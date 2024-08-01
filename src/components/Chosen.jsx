import { useRef, useState, useMemo, useEffect } from 'react';
import styles from '../styles/Chosen.module.css';

import Arrow from './svg/Arrow';
import Close from './svg/Close';
import Loading from './svg/Loading';
import Search from './svg/Search';
import List from './List';

const Chosen = (props) => {
    const divRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState({});
    const [search, setSearch] = useState('');
    const [pointer, setPointer] = useState(-1);

    const selected = useMemo(() => {
        const arr = Object.keys(selectedValue);
        return props.multiple ? arr : (arr[0] ? arr[0] : '');
    }, [selectedValue]);

    const flattenObject = (obj) => {
        const flattened = {};

        const flatten = (item) => {
            for (let key in item) {
                if (typeof item[key] === 'object' && item[key] !== null) {
                    flatten(item[key]);
                } else {
                    flattened[key] = item[key];
                }
            }
        };

        flatten(obj);
        return flattened;
    };

    const filterBySearch = (values) => {
        let results = {};

        for (let key in values) {
            const obj = values[key];

            if (typeof obj === 'object' && obj !== null) {
                const nestedResults = filterBySearch(obj);
                if (Object.keys(nestedResults).length > 0) {
                    results[key] = nestedResults;
                }
            } else if (obj && typeof obj === 'string' && obj.toLowerCase().includes(search.toLowerCase())) {
                results[key] = obj;
            }
        }

        return results;
    }

    const actionOnScroll = typeof props.onScrollToListBottom === 'function';
    const customSearch = typeof props.onSearch === 'function';

    const filteredValues = customSearch ? props.values : filterBySearch(props.values);
    const flattenFilteredValues = flattenObject(filteredValues);

    const pointedValue = useMemo(() => {
        return Object.keys(flattenFilteredValues)[pointer];
    }, [pointer]);

    const pointValue = (num) => {
        if (Object.keys(flattenFilteredValues)[pointer + num]) {
            setPointer(prevPointer => prevPointer + num);
        }
    };

    const selectValue = (value) => {
        if (!selected.includes(value)) {
            setSelectedValue(prevSelected => ({
                ...(props.multiple ? prevSelected : {}),
                ...Object.fromEntries(Object.entries(flattenFilteredValues).filter(([key]) => key === value))
            }));
            setIsOpen(false);
        }
    };

    const unselectValue = (value) => {
        if (selected.includes(value)) {
            setSelectedValue(prevSelected => Object.fromEntries(Object.entries(prevSelected).filter(([key]) => key !== value)));
        }
    };

    const removeLastSelected = () => {
        if (!search) {
            const keys = Object.keys(selectedValue);
            if (keys.length) {
                unselectValue(keys[keys.length - 1]);
            }
        }
    };

    const handleKeyUp = (e) => {
        switch (e.key) {
            case 'ArrowUp':
                pointValue(-1);
                break
            case 'ArrowDown':
                if (!isOpen) {
                    setIsOpen(true)
                } else {
                    pointValue(1);
                }
                break
            case 'Enter':
                selectValue(pointedValue);
                break
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace') {
            removeLastSelected();
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (divRef.current && !divRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        } else {
            setSearch('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (customSearch) {
            props.onSearch(search)
        }
    }, [search]);

    useEffect(() => {
        setPointer(-1);

        if (actionOnScroll && listRef.current) {
            const handleScroll = () => {
                const alreadyScrolledHeight = listRef.current.clientHeight + (listRef.current.pageYOffset || listRef.current.scrollTop)
                if (alreadyScrolledHeight >= listRef.current.scrollHeight) {
                    props.onScrollToListBottom(search)
                }
            };

            listRef.current.addEventListener('scroll', handleScroll);

            return () => {
                if (listRef.current) {
                    listRef.current.removeEventListener('scroll', handleScroll);
                }
            };
        }
    }, [isOpen, search]);

    return (
        <div className={`relative ${props.className}`} ref={divRef}>
            {props.multiple && <ul className={`bg-white border border-slate-400 rounded py-0.5 px-1 min-h-9 cursor-pointer ${isOpen ? 'border-b-0 rounded-b-none' : ''}`} onClick={() => setIsOpen(true)}>
                {selected.map(key => (
                    <li key={key} className={`relative float-left border border-slate-400 rounded m-1 ml-0 p-1 pr-5 leading-3 text-gray-700 ${styles.selectChoice}`}>
                        <span>
                            {selectedValue[key]}
                        </span>
                        <a className={`absolute top-0.5 right-0.5 w-4 h-4 cursor-pointer`} onClick={() => unselectValue(key)}>
                            <Close className={`stroke-2 stroke-slate-400 hover:stroke-slate-500`} />
                        </a>
                    </li>
                ))}
                <li className={`float-left`}>
                    <input
                        type="text"
                        autoComplete="off"
                        className={`bg-transparent w-6 h-6 mt-0.5 focus:outline-none`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyUp={handleKeyUp}
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                    />
                </li>
                <li className={`clear-left`}></li>
            </ul>}
            {!props.multiple && <a
                className={`relative block h-9 pl-2 border border-slate-400 rounded leading-6 cursor-pointer ${isOpen ? styles.selectOpen + ' border-b-0 rounded-b-none' : styles.selectSingle}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`block truncate mt-1 mr-6`}>
                    {selectedValue[selected]}
                </span>
                <Arrow className={`absolute top-1/3 right-2 w-2 h-2 fill-slate-400`} transform={isOpen ? 'rotate(180)' : ''} />
            </a>}
            {isOpen && <div className={`border border-t-0 border-slate-400 ${!props.multiple ? 'rounded-b' : 'rounded-b'}`}>
                {!props.multiple && <div className={`relative p-1`}>
                    <input
                        type="text"
                        autoComplete="off"
                        className={`bg-white border border-slate-400 w-full h-8 pl-1 pr-6 focus:outline-none`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyUp={handleKeyUp}
                        ref={inputRef}
                    />
                    <Search className={`absolute top-1/4 right-2 w-5 h-5 stroke-2 stroke-slate-400`} />
                </div>}
                <List
                    className={`${props.multiple ? 'max-h-64' : 'max-h-52'} overflow-y-auto`}
                    data={filteredValues}
                    openAll={search || pointedValue}
                    selected={selected}
                    selectCallback={selectValue}
                    pointedValue={pointedValue}
                    innerRef={listRef}
                />
            </div>}
            {props.loading && <Loading />}
        </div>
    );
};

export default Chosen;