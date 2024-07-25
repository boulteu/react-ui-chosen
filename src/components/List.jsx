import { useState } from 'react';
import styles from '../styles/Chosen.module.css';
import Arrow from './svg/Arrow';

const List = (props) => {
    const [opened, setOpened] = useState({});

    const updateOpened = (key, value) => {
        const updatedOpened = { ...opened };
        updatedOpened[key] = value;
        setOpened(updatedOpened);
    };
    const renderListItems = (obj) => {
        return Object.keys(obj).map((key, index) => {
            const value = obj[key];

            if (typeof value === 'object' && value !== null) {
                return (
                    <li
                        key={key}
                        onClick={(e) => { e.stopPropagation(); updateOpened(key, !opened[key]); }}
                    >
                        <div className={`relative font-bold p-1 hover:cursor-pointer`}>
                            {key}
                            <Arrow className={`absolute top-1/3 right-2 w-2 h-2`} transform={opened[key] ? 'rotate(180)' : ''} />
                        </div>
                        <ul className={`${!opened[key] && !props.openAll ? 'hidden' : ''}`}>
                            {Array.isArray(value) ? value.map((item) => (renderListItems(item))) : renderListItems(value)}
                        </ul>
                    </li>
                );
            }

            return (
                <li
                    key={key}
                    className={`p-1 ${props.selected.includes(key) ? 'text-slate-400 hover:cursor-not-allowed' : styles.selectResult + ' hover:text-white hover:cursor-pointer'}`}
                    onClick={(e) => { e.stopPropagation(); props.selectCallback(key); }}
                >
                    {value}
                </li>
            );
        });
    };

    return (
        <ul className={props.className} ref={props.innerRef}>
            {Object.keys(props.data).length ? renderListItems(props.data) : <li className={`p-1 text-slate-400 hover:cursor-not-allowed`}>No results match</li>}
        </ul>
    );
};

export default List;