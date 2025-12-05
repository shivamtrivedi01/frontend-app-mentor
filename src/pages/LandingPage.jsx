import {Tab, Tabs} from "@openedx/paragon";
import './landing-page.scss'
import MentorSchedule from "./mentor-schedule/MentorSchedule";
import ManageMentor from "./manage-mentor/ManageMentor";
import {connect} from "react-redux";
import {fetchMyRoles, fetchMentorList} from "../common/data/thunks";
import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router";
import {usePermission} from "../common/context/PermissionContext";

const LandingPage = (props) => {
    // Add actions to props here
    const {
        fetchMyRoles,
        fetchMentorList
    } = props;
    // Add state variables
    const {myRolesInfo} = props;
    const {courseId: courseIdFromUrl} = useParams();


    useEffect(() => {
        fetchMyRoles(courseIdFromUrl);
    }, []);

    useEffect(() => {
        if (myRolesInfo?.is_superuser) {
            fetchMentorList(courseIdFromUrl);
        }
    }, [myRolesInfo]);

    return <div className="mentor-app-landing-page">
        {myRolesInfo?.is_superuser && <Tabs
            variant="tabs"
        >

            <Tab eventKey="mentor-schedule" title="Schedule" className="mentor-schedule">
                <MentorSchedule myRolesInfo={myRolesInfo}/>
            </Tab>
            <Tab eventKey="mentor-magement" title="Manage Mentors" className="mentor-management">
                <ManageMentor myRolesInfo={myRolesInfo}/>
            </Tab>
        </Tabs>}
        {!myRolesInfo?.is_superuser && <Tabs
            variant="tabs"
        >

            <Tab eventKey="mentor-schedule" title="Schedule" className="mentor-schedule">
                <MentorSchedule myRolesInfo={myRolesInfo}/>
            </Tab>
        </Tabs>}
    </div>
}

function mapStateToProps(state) {
    return {
        myRolesInfo: state.commonReducer.myRolesInfo,
    }
}

export default connect(
    mapStateToProps, {
        // Add any actions you want to map to props here
        fetchMyRoles,
        fetchMentorList,
    }
)(LandingPage);
