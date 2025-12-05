import {getAuthenticatedHttpClient} from "@edx/frontend-platform/auth";
import {getConfig} from "@edx/frontend-platform";

export async function createAppointmentSlot(slot, viewState) {
    const url = `${getConfig().LMS_BASE_URL}/mentoring/api/v1/mentoring-available-slots/`;
    return getAuthenticatedHttpClient().post(url, slot, {params: {...viewState}});
}

    export async function fetchAppointmentSlotApi(userId, courseId, params) {
        const filters = {
            course_id: courseId,
            ...params
        }
        if (userId)
            filters.user = userId
        const url = `${getConfig().LMS_BASE_URL}/mentoring/api/v1/mentoring-available-slots/`;
        return getAuthenticatedHttpClient().get(url, {params: {page_size: 1000, ...filters}});
    }

    export async function updateAppointmentSlotApi(slot, id, viewState) {
        const url = `${getConfig().LMS_BASE_URL}/mentoring/api/v1/mentoring-available-slots/${id}/`;
        return getAuthenticatedHttpClient().patch(url, slot, {params: {...viewState}});
    }

    export async function deleteAppointmentSlotApi(id) {
        const url = `${getConfig().LMS_BASE_URL}/mentoring/api/v1/mentoring-available-slots/${id}/`;
        return getAuthenticatedHttpClient().delete(url);
    }
