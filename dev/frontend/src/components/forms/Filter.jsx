import { observer } from "mobx-react-lite";
import Form from 'react-bootstrap/Form';
import { useType } from "../../hooks/useTypes";

export const Filter = observer(({ data, setData }) => {
    const { type } = useType();

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
            <Form.Select
                className="my-3 shadow"
                onChange={handleTypeChange}
                value={data.typeId ?? 0}
            >
                <option value={0}>Todos tipos</option>
                {type.types.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                ))}
            </Form.Select>

            <Form.Select
                className="my-3 shadow"
                onChange={handleSortedByChange}
                value={data.sortedBy ?? ''}
            >
                <option value={""}>Sem filtro</option>
                <option value={"newest"}>Mais novos</option>
                <option value={"oldest"}>Mais velhos</option>
            </Form.Select>

        </Form>
    )
})