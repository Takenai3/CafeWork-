import { useEffect, useState } from "react";

import {
    getSearchHistory,
    deleteSearchHistory
} from "../services/searchHistoryService";

const SearchHistory = ({ onHistoryClick }) => {

    const [history, setHistory] = useState([]);

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                const data = await getSearchHistory();

                console.log(data);

                setHistory(data);

            } catch (err) {

                console.error(err);
            }
        };

        fetchHistory();

    }, []);

    const handleDelete = async (id) => {

        try {

            await deleteSearchHistory(id);

            setHistory((prev) =>
                prev.filter((item) => item.id !== id)
            );

        } catch (err) {

            console.error("Lỗi xóa lịch sử:", err);
        }
    };

    return (

        <div style={{ padding: "16px" }}>

            <h3>検索履歴</h3>

            {history.map(item => (

                <div
                    key={item.id}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        borderBottom: '1px solid #eee'
                    }}
                >

                    <div
                        onClick={() => onHistoryClick(item.keyword)}
                        style={{
                            cursor: 'pointer',
                            flex: 1
                        }}
                    >
                        🔍 {item.keyword}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                        }}
                        style={{
                            border: 'none',
                            background: 'none',
                            color: 'red',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        ✕
                    </button>

                </div>

            ))}

        </div>
    );
};

export default SearchHistory;