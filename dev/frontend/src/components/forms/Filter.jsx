import { observer } from "mobx-react-lite";
import Form from 'react-bootstrap/Form';
import { useType } from "../../hooks/useTypes";
import { useEffect } from "react";

export const Filter = observer(({ data, setData }) => {
    const { getAndStoreTypes, type } = useType();

    useEffect(() => {
        getAndStoreTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTypeChange = (e) => {
        setData({
            ...data,
            typeId: e.target.value,
            page: 1 // Resetar para a primeira página ao mudar de tipo
        });
    };

    const handleSortedByChange = (e) => {
        setData({
            ...data,
            sortedBy: e.target.value,
            page: 1 // Resetar para a primeira página ao mudar de tipo
        });
    };
    return (
        <Form>
            <Form.Select className="my-3 shadow" onChange={handleTypeChange}>
                <option value={0}>Todos tipos</option>
                {(Array.isArray(type.types) ? type.types : []).map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                ))}
            </Form.Select>
            <Form.Select className="my-3 shadow" onChange={handleSortedByChange}>
                <option value={""}>Sem filtro</option>
                <option value={"newest"}>Mais novos</option>
                <option value={"oldest"}>Mais velhos</option>
            </Form.Select>
        </Form>
    )
})