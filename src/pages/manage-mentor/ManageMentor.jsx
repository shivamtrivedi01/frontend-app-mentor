import {connect} from "react-redux";
import TableView from "../../atoms/TableView";
import {fetchNonSuperUsers,toggleMentor} from "./data/thunks";
import {useEffect} from "react";
import {useParams} from "react-router";

const ManageMentor = (props) => {
    const {
        fetchNonSuperUsers,
        toggleMentor,
        nonSupervisorMentor,
    } = props
    const {courseId: courseIdFromUrl} = useParams();

    useEffect(() => {
        fetchNonSuperUsers(courseIdFromUrl);
    }, []);

    return (
        <div>
            <h1>Manage Mentor</h1>
            <TableView
                data={nonSupervisorMentor}
                initialState={{
                    pageSize: 30,
                }}
                columns={
                    [
                        {
                            Header: 'Username',
                            accessor: 'username',

                        },
                        {
                            Header: 'Email',
                            accessor: 'email',
                        }
                    ]
                }
                toggleRole={(row) => {
                    console.log("Assign", row)
                    toggleMentor(row.original.username, courseIdFromUrl)
                }}
            />
        </div>
    );
}

function mapStateToProps(state) {
    return {
        courseId: state.mentorManagementReducer.courseId,
        nonSupervisorMentor: state.mentorManagementReducer.nonSupervisorMentor,
    };
}

export default connect(mapStateToProps, {
    fetchNonSuperUsers,
    toggleMentor
})(ManageMentor);
