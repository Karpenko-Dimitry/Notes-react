import React, { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';

import CategoriesService from '../../services/CategoriesService';
import TagsService from '../../services/TagsService';
import LanguagesService from '../../services/LanguagesService';

import Header from '../elements/Header';
import Spiner from '../elements/Spiner';
import NoteService from '../../services/NotesService';

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
        return [...prev, ..._new];
    }, '');

    const [card, setCard] = useState('en');
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [errors, setErrors] = useState({});
    const [load, setLoad] = useState(true);
    const [_public, setPublic] = useState(true);
    const [files, setFiles] = useState([]);

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
            (res) => setLanguages(res.data.data),
            (res) => setErrors(res.data.errors),
        );
        setLoad(false);
    }, []);

    const doCreate = () => {
        setErrors({});

        let formData = new FormData();

        formData.append('public', _public ? 1 : 0);
        formData.append('translations', JSON.stringify(translations));

        for (let i = 0; i < files.length; i++) {
            formData.append('user_file[]', files[i], files[i]['name']);
        }

        for (let i = 0; i < selectedCategories.length; i++) {
            formData.append('category[]', selectedCategories[i]);
        }

        NoteService.store(formData).then(
            (res) => history.push('/notes/' + res.data.data.uid),
            (res) => setErrors(res.data.errors),
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

                                            {(errors[language.type + '_title'] || []).map(
                                                (error) => {
                                                    return (
                                                        <p
                                                            key={`${error}-title-error`}
                                                            className="text-danger">
                                                            {error}
                                                        </p>
                                                    );
                                                },
                                            )}

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

                                            {(errors[language.type + '_content'] || []).map(
                                                (error) => {
                                                    return (
                                                        <p
                                                            key={`${error}-text-error`}
                                                            className="text-danger">
                                                            {error}
                                                        </p>
                                                    );
                                                },
                                            )}
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
                                                name="category[]"
                                                onClick={(e) =>
                                                    setSelectedCategories(e.target.value)
                                                }
                                                value={category.id}
                                                // {category.id}
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

                            {(errors.category || []).map((error) => {
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
                                    onChange={(e) => setFiles(e.target.files)}
                                    multiple
                                />
                                <ul>
                                    {files[0] &&
                                        Array.from(files).map((file) => (
                                            <li key={file.name}>{file.name}</li>
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

                            {/* <div className="form-group form-check mt-3 text-left">
                                <label htmlFor="tags" className="form-check-label">Hash Tag</label>
                                <select className="form-check-input chosen-select" id=>
                                    <option value="">test</option>
                                </select>
                                {!! Form::select('tags', $tags, null, ['className' => 'form-check-input chosen-select', 'id' => 'hashtag']) !!}
                            </div> */}

                            <div className="d-flex justify-content-center mt-3">
                                <input
                                    className="btn btn-secondary btn-lg"
                                    type="submit"
                                    value="Add note"
                                />
                            </div>
                        </form>
                        {/* {!! Form::open(['url' => url_locale('/notes'), 'method' => 'post', 'files' => true]) !!}
                            @foreach($languages as $language)
                                <div className="language-body" id="{{$language->type}}_body">
                                    <h2>{{__('title.add_note')}}</h2>
                                    <div className="input-group mt-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">
                                                {{__('common.title')}}
                                                {{__('common.' . $language->type)}}
                                            </span>
                                        </div>
                                        {!! Form::text($language->type . '_title', null, ['className' => 'form-control']) !!}
                                    </div>
                                    <p className="text-danger">
                                        {{$errors->first($language->type . '_title') ? $errors->first($language->type . '_title') : ''}}
                                    </p>
                                    <div className="input-group mt-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                {{__('common.text')}}
                                                {{__('common.' . $language->type)}}
                                            </span>
                                        </div>
                                        {!! Form::textarea($language->type . '_content', null, ['className' => 'form-control']) !!}
                                    </div>
                                    <p className="text-danger">
                                        {{$errors->first($language->type . '_content') ? $errors->first($language->type . '_content') : ''}}
                                    </p>
                                </div>
                            @endforeach
                            <div className="d-flex flex-wrap">
                                    <p className="font-italic mr-3 mb-0">{{__('common.choose_cat')}}</p>
                                @foreach ($categoriesList as $category)
                                    <div className="mr-3">
                                        {!! Form::checkbox('category[]', $category->id, false, ['id' => "category $category->id"]) !!}
                                        {!! Form::label("category $category->id", $category->name, ['className' => 'mb-0']) !!}
                                    </div>
                                @endforeach
                            </div>
                            <p className="text-danger">
                                {{$errors->first('category') ? $errors->first('category') : ''}}
                            </p>
                            <div className="form-group mt-3 text-left">
                                {!! Form::label('userFile', __('common.upload'), ['className' => 'btn btn-secondary btn-sm']) !!}
                                {!! Form::file('user_file[]', ['id' => 'userFile', 'hidden', 'className' => 'form-control-file']) !!}
                                <ul className="files-list">
                                </ul>
                            </div>
                            <div className="form-group form-check mt-3 text-left">
                                {!! Form::checkbox('public', '1', true, ['className' => 'form-check-input', 'id' => 'exampleCheck1']) !!}
                                {!! Form::label('exampleCheck1', __('common.m_public'), ['className' => 'form-check-label']) !!}
                            </div>
                            <div className="form-group form-check mt-3 text-left">
                                {!! Form::label('tags', 'Hash Tag', ['className' => 'form-check-label']) !!}
                                {!! Form::select('tags', $tags, null, ['className' => 'form-check-input chosen-select', 'id' => 'hashtag']) !!}
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                {!! Form::submit(__('common.add_note'), ['className' => 'btn btn-secondary btn-lg']) !!}
                            </div>
                        {!! Form::close() !!} */}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Create;
