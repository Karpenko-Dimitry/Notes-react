import React, { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';

import CategoriesService from '../../services/CategoriesService';
import TagsService from '../../services/TagsService';
import LanguagesService from '../../services/LanguagesService';

import Header from '../elements/Header';
import Spiner from '../elements/Spiner';
import NoteService from '../../services/NotesService';
import FilesServices from '../../services/FilesServices';

const Create = () => {
    const history = useHistory();
    const [translations, settranslations] = useReducer((prev, _new) => {
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
    const [tags, setTags] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [errors, setErrors] = useState({});
    const [load, setLoad] = useState(true);
    const [_public, setPublic] = useState(true);
    const [upLoadedFiles, setUpLoadedFiles] = useReducer((prev, _new) => {
        return { ...prev, ..._new };
    }, []);

    useEffect(() => {
        CategoriesService.list().then(
            (res) => setCategories(res.data.data),
            (res) => setErrors(res.data.message),
        );
        TagsService.list().then(
            (res) => setTags(res.data.data),
            (res) => setErrors(res.data.message),
        );
        LanguagesService.list().then(
            (res) => {
                setLanguages(res.data.data);
                settranslations({ en: {}, ru: {} });
            },
            (res) => setErrors(res.data.errors),
        );
        setLoad(false);
    }, []);

    const doCreate = () => {
        setErrors({});

        NoteService.store({
            public: _public,
            translations,
            category: Object.keys(selectedCategories),
            files: Object.keys(upLoadedFiles),
        }).then(
            (res) => {
                console.log(res);
                history.push('/notes/' + res.data.data.uid);
            },
            (res) => {
                console.log(res);
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
                    [id]: {},
                });
            },
            (res) => {
                setErrors(res.data.errors);
            },
        );
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
                                                {item.type}
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
                            {languages &&
                                (languages || []).map((language) => {
                                    return (
                                        <div
                                            key={`${language.type}-body`}
                                            className={`language-body ${
                                                language.type === card ? '' : 'hidden'
                                            }`}
                                            id={`${language.type}_body`}>
                                            <h2 key>Add new note</h2>
                                            <div className="input-group mt-3">
                                                <div className="input-group-prepend">
                                                    <span
                                                        className="input-group-text"
                                                        id="basic-addon1">
                                                        Title ({language.type})
                                                    </span>
                                                </div>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name={`${language.type}_title`}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        settranslations({
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
                                                        Text ({language.type})
                                                    </span>
                                                </div>
                                                <textarea
                                                    className="form-control"
                                                    rows="10"
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        settranslations({
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
                                <p className="font-italic mr-3 mb-0">Choose category</p>
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
                                    Upload files
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
                                    Make public
                                </label>
                            </div>
                            <div className="form-group form-check mt-3 text-left">
                                <label htmlFor="hashtag" className="form-check-label">
                                    Hash Tag
                                </label>
                                <div>
                                    <select id="hashtag" name="tags">
                                        {(tags || []).map((tag) => (
                                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center mt-3">
                                <input
                                    className="btn btn-secondary btn-lg"
                                    type="submit"
                                    value="Add note"
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
