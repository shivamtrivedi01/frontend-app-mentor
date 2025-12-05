import {getAuthenticatedHttpClient} from "@edx/frontend-platform/auth";
import {getConfig} from "@edx/frontend-platform";

export async function fetchAvailableBookingApi(userId, courseId, start, end) {
    const url = `${getConfig().LMS_BASE_URL}/mentoring/api/course/${courseId}/available-student-slots/`;
    return getAuthenticatedHttpClient().get(url, {params: {start, end}});
}

export async function bookMentoringSlotApi(payload) {
    const url = `${getConfig().LMS_BASE_URL}/mentoring/api/v1/mentoring-events/`;
    return getAuthenticatedHttpClient().post(url, payload);
}
export async function cancelMentoringSlotApi(id) {
    const url = `${getConfig().LMS_BASE_URL}/mentoring/api/v1/mentoring-events/${id}/`;
    return getAuthenticatedHttpClient().delete(url);
}
