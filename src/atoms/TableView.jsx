import {Button, DataTable} from "@openedx/paragon";

const TableView = (props) => {
    const {data, columns, toggleRole, initialState} = props
    return (
        <DataTable
            columns={columns}
            itemCount={data?.length}
            data={data}
            initialState={initialState}
            isPaginated={true}
            additionalColumns={[
                {
                    id: 'action',
                    Header: 'Action',
                    // Proptypes disabled as this prop is passed in separately
                    Cell: ({row}) => {

                        return <Button variant="link" onClick={() => {
                            if (toggleRole)
                                toggleRole(row);
                        }}>{row.original.has_mentorship ? 'Remove Mentorship' : 'Assign Mentorship'}</Button>
                    },
                }
            ]}
        >
            <DataTable.TableControlBar />
            <DataTable.Table />
            <DataTable.EmptyTable content="No results found" />
            <DataTable.TableFooter />
        </DataTable>
    )
}

export default TableView;
