import { useMutation } from '@apollo/client';
import { FaTrash } from 'react-icons/fa';
import { DELETE_CLIENT } from '../../mutations/clientMutation';
import { GET_CLIENTS } from '../../queries/clientQuery';
import { GET_PROJECTS } from '../../queries/projectQueries';

function ClientRow({ client }) {
    const [deleteClient] = useMutation(DELETE_CLIENT, {
        variables: { id: client.id },
        refetchQueries: [{ query: GET_CLIENTS }, { query: GET_PROJECTS }],
        // refetchQueries: [{ query: GET_CLIENTS }],//1-variant
        // update(cache, { data: { deleteClient } }) {//доп написать в аpp cache операции
        //     const { clients } = cache.readQuery({ query: GET_CLIENTS });
        //     cache.writeQuery({
        //         query: GET_CLIENTS,
        //         data: { clients: clients.filter(client => client.id !== deleteClient.id) },
        //     });
        // },
    });
    return (
        <tr>
            <td>{client.name}</td>
            <td>{client.email}</td>
            <td>{client.phone}</td>
            <td>
                <button className="btn btn-danger btn-sm" onClick={deleteClient}>
                    <FaTrash />
                </button>
            </td>
        </tr>
    )
};

export default ClientRow