import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WithContext as ReactTags } from 'react-tag-input';

import CategoriesService from '../../services/CategoriesService';
import TagsService from '../../services/TagsService';
import LanguagesService from '../../services/LanguagesService';

import Header from '../elements/Header';
import Spiner from '../elements/Spiner';
import NoteService from '../../services/NotesService';
import FilesServices from '../../services/FilesServices';

import { LocaleContext } from '../../contexts/LocaleContext';

import '../css/tags.scss';

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const Create = () => {
    const [tags, setTags] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const currentLocale = useContext(LocaleContext);
    const { t } = useTranslation(['title']);
    const history = useHistory();
    const [translations, setTranslations] = useReducer((prev, _new) => {
        let result = {};

        for (let language in _new) {
            result = { ...prev, ...{ [language]: { ...prev[language], ..._new[language] } } };
        }

        return result;
    }, {});

    const [selectedCategories, setSelectedCategories] = useReducer((prev, _new) => {
        let result = { ...prev, ..._new };

        for (let id in result) {
            if (!result[id]) {
                delete result[id];
            }
        }

        return result;
    }, []);

    const [card, setCard] = useState('en');
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [errors, setErrors] = useState({});
    const [load, setLoad] = useState(true);
    const [_public, setPublic] = useState(true);

    const [upLoadedFiles, setUpLoadedFiles] = useReducer((prev, _new) => {
        let newState = { ...prev, ..._new };

        for (let key in newState) {
            if (!newState[key]) {
                delete newState[key];
            }
        }

        return newState;
    }, []);

    useEffect(() => {
        CategoriesService.list(null, {}, { locale: currentLocale.get() }).then(
            (res) => setCategories(res.data.data),
            (res) => setErrors(res.data.message),
        );
        TagsService.list().then(
            (res) =>
                setSuggestions(() => {
                    let tags = res.data.data;
                    tags.forEach((item, key, array) => {
                        item.text = item.name;
                        item.id = item.name;
                    });
                    return [...tags];
                }),
            (res) => setErrors(res.data.message),
        );
        LanguagesService.list().then(
            (res) => {
                setLanguages(res.data.data);
            },
            (res) => setErrors(res.data.errors),
        );
        setLoad(false);
    }, [currentLocale]);

    useEffect(() => {
        if (languages) {
            languages.forEach((item) => setTranslations({ [item.type]: {} }));
        }
    }, [languages]);

    const doCreate = () => {
        setErrors({});

        NoteService.store({
            public: _public,
            translations,
            category: Object.keys(selectedCategories),
            files: Object.keys(upLoadedFiles),
            tags: tags.map((item) => item.text),
        }).then(
            (res) => {
                history.push('/notes/' + res.data.data.uid);
            },
            (res) => {
                setErrors(res.data.errors);
            },
        );
    };

    const doUpLoad = (files) => {
        for (let i = 0; i < files.length; i++) {
            let formData = new FormData();

            formData.append('user_file', files[i], files[i]['name']);

            FilesServices.store(formData).then(
                (res) => {
                    setUpLoadedFiles({
                        [res.data.data.id]: { name: files[i]['name'], ...res.data.data },
                    });
                },
                (res) => {
                    setErrors(res.data.errors);
                },
            );
        }
    };

    const doDeleteUploaded = (id) => {
        FilesServices.delete(id).then(
            (res) => {
                setUpLoadedFiles({
                    [id]: false,
                });
            },
            (res) => {
                setErrors(res.data.errors);
            },
        );
    };

    const handleDelete = (i) => {
        setTags((prev) => prev.filter((tag, index) => index !== i));
    };

    const handleAddition = (tag) => {
        setTags((prev) => [...prev, tag]);
    };

    const handleDrag = (tag, currPos, newPos) => {
        const tagState = [...tags];
        const newTags = tagState.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        setTags(newTags);
    };

    return (
        <>
            <Header />
            <main role="main" className="container">
                <div className="card text-center">
                    {load && <Spiner />}
                    <div className="card-header ">
                        <ul className="nav nav-tabs card-header-tabs">
                            {languages &&
                                languages.map((item) => {
                                    return (
                                        <li key={`${item.type}-language`} className="nav-item">
                                            <div
                                                className={`nav-link language-card ${
                                                    item.type === card ? 'active' : ''
                                                }`}
                                                id={item.type}
                                                onClick={() => {
                                                    setCard(item.type);
                                                }}>
                                                {t('common:' + item.type)}
                                            </div>
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                    <div className="card-body">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                doCreate();
                            }}>
                            {Object.keys(translations).length !== 0 &&
                                (languages || []).map((language) => {
                                    return (
                                        <div
                                            key={`${language.type}-body`}
                                            className={`language-body ${
                                                language.type === card ? '' : 'hidden'
                                            }`}
                                            id={`${language.type}_body`}>
                                            <h2 key>{t('title:add_note')}</h2>
                                            <div className="input-group mt-3">
                                                <div className="input-group-prepend">
                                                    <span
                                                        className="input-group-text"
                                                        id="basic-addon1">
                                                        {t('common:title')} (
                                                        {t('common:' + language.type)})
                                                    </span>
                                                </div>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name={`${language.type}_title`}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        setTranslations({
                                                            [language['type']]: {
                                                                title: e.target.value,
                                                            },
                                                        });
                                                    }}
                                                    value={
                                                        translations[language['type']]
                                                            ? translations[language['type']][
                                                                  'title'
                                                              ]
                                                            : ''
                                                    }
                                                />
                                            </div>

                                            {(
                                                (errors &&
                                                    errors[
                                                        `translations.${language['type']}.title`
                                                    ]) ||
                                                []
                                            ).map((error) => {
                                                return (
                                                    <p
                                                        key={`${error}-title-error`}
                                                        className="text-danger">
                                                        {
                                                            errors[
                                                                `translations.${language['type']}.title`
                                                            ]
                                                        }
                                                    </p>
                                                );
                                            })}

                                            <div className="input-group mt-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text">
                                                        {t('common:text')} (
                                                        {t('common:' + language.type)})
                                                    </span>
                                                </div>
                                                <textarea
                                                    className="form-control"
                                                    rows="10"
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        setTranslations({
                                                            [language['type']]: {
                                                                content: e.target.value,
                                                            },
                                                        });
                                                    }}
                                                    value={
                                                        translations[language['type']]
                                                            ? translations[language['type']][
                                                                  'content'
                                                              ]
                                                            : ''
                                                    }
                                                />
                                            </div>

                                            {(
                                                (errors &&
                                                    errors[
                                                        `translations.${language['type']}.content`
                                                    ]) ||
                                                []
                                            ).map((error) => {
                                                return (
                                                    <p
                                                        key={`${error}-text-error`}
                                                        className="text-danger">
                                                        {error}
                                                        {error['translations.en.content']}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                    );
                                })}

                            <div className="d-flex flex-wrap mt-3">
                                <p className="font-italic mr-3 mb-0">{t('common:choose_cat')}</p>
                                {categories.map((category) => {
                                    return (
                                        <div key={`${category.name}`} className="mr-3">
                                            <input
                                                className="mr-1"
                                                type="checkbox"
                                                id={`category${category.id}`}
                                                name="category"
                                                onClick={(e) => {
                                                    setSelectedCategories({
                                                        [category.id]: e.target.checked,
                                                    });
                                                }}
                                                value={category.id}
                                            />
                                            <label
                                                className="mb-0"
                                                htmlFor={`category${category.id}`}>
                                                {category.name}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>

                            {((errors && errors.category) || []).map((error) => {
                                return (
                                    <p key={`${error}-category-error`} className="text-danger">
                                        {error}
                                    </p>
                                );
                            })}

                            <div className="form-group mt-3 text-left">
                                <label htmlFor="userFile" className="btn btn-secondary btn-sm">
                                    {t('common:upload')}
                                </label>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="userFile"
                                    name="user_file[]"
                                    onChange={(e) => {
                                        doUpLoad(e.target.files);
                                    }}
                                    multiple
                                />
                                <ul>
                                    {Object.values(upLoadedFiles)[0] &&
                                        Object.values(upLoadedFiles).map((file, id) => (
                                            <li key={id} className={file.name ? '' : 'hidden'}>
                                                <i
                                                    className="fas fa-times mr-3"
                                                    onClick={() => doDeleteUploaded(file.id)}></i>
                                                {file.name}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                            <div className="form-group form-check text-left">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="exampleCheck1"
                                    name="public"
                                    onChange={(e) => {
                                        setPublic((prev) => !prev);
                                    }}
                                    checked={_public}
                                />
                                <label className="form-check-label " htmlFor="exampleCheck1">
                                    {t('common:m_public')}
                                </label>
                            </div>
                            <div className="form-group form-check mt-3 text-left">
                                <label htmlFor="hashtag" className="form-check-label">
                                    {t('common:tag')}
                                </label>
                                <div>
                                    <ReactTags
                                        tags={tags}
                                        suggestions={suggestions}
                                        handleDelete={handleDelete}
                                        handleAddition={handleAddition}
                                        handleDrag={handleDrag}
                                        delimiters={delimiters}
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-center mt-3">
                                <input
                                    className="btn btn-secondary btn-lg"
                                    type="submit"
                                    value={t('common:add_note')}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Create;
