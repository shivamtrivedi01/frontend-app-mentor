import {getAuthenticatedHttpClient} from "@edx/frontend-platform/auth";
import {getConfig} from "@edx/frontend-platform";

export async function fetchNonSuperUsersApi(courseId) {
    const url = `${getConfig().LMS_BASE_URL}/mentoring/api/v1/course/${courseId}/mentoring-non-super-users/`;
    return getAuthenticatedHttpClient().get(url);
}

export function toggleMentorApi(username, courseId) {
    const url = `${getConfig().LMS_BASE_URL}/mentoring/api/v1/toggle-mentorship/course/${courseId}/user/${username}/`;
    return getAuthenticatedHttpClient().get(url);
}
