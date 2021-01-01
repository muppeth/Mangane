import api from '../api';
import { importFetchedStatuses } from 'soapbox/actions/importer';

export const ADMIN_CONFIG_FETCH_REQUEST = 'ADMIN_CONFIG_FETCH_REQUEST';
export const ADMIN_CONFIG_FETCH_SUCCESS = 'ADMIN_CONFIG_FETCH_SUCCESS';
export const ADMIN_CONFIG_FETCH_FAIL    = 'ADMIN_CONFIG_FETCH_FAIL';

export const ADMIN_CONFIG_UPDATE_REQUEST = 'ADMIN_CONFIG_UPDATE_REQUEST';
export const ADMIN_CONFIG_UPDATE_SUCCESS = 'ADMIN_CONFIG_UPDATE_SUCCESS';
export const ADMIN_CONFIG_UPDATE_FAIL    = 'ADMIN_CONFIG_UPDATE_FAIL';

export const ADMIN_REPORTS_FETCH_REQUEST = 'ADMIN_REPORTS_FETCH_REQUEST';
export const ADMIN_REPORTS_FETCH_SUCCESS = 'ADMIN_REPORTS_FETCH_SUCCESS';
export const ADMIN_REPORTS_FETCH_FAIL    = 'ADMIN_REPORTS_FETCH_FAIL';

export const ADMIN_REPORTS_PATCH_REQUEST = 'ADMIN_REPORTS_PATCH_REQUEST';
export const ADMIN_REPORTS_PATCH_SUCCESS = 'ADMIN_REPORTS_PATCH_SUCCESS';
export const ADMIN_REPORTS_PATCH_FAIL    = 'ADMIN_REPORTS_PATCH_FAIL';

export const ADMIN_USERS_FETCH_REQUEST = 'ADMIN_USERS_FETCH_REQUEST';
export const ADMIN_USERS_FETCH_SUCCESS = 'ADMIN_USERS_FETCH_SUCCESS';
export const ADMIN_USERS_FETCH_FAIL    = 'ADMIN_USERS_FETCH_FAIL';

export const ADMIN_USERS_DELETE_REQUEST = 'ADMIN_USERS_DELETE_REQUEST';
export const ADMIN_USERS_DELETE_SUCCESS = 'ADMIN_USERS_DELETE_SUCCESS';
export const ADMIN_USERS_DELETE_FAIL    = 'ADMIN_USERS_DELETE_FAIL';

export const ADMIN_USERS_APPROVE_REQUEST = 'ADMIN_USERS_APPROVE_REQUEST';
export const ADMIN_USERS_APPROVE_SUCCESS = 'ADMIN_USERS_APPROVE_SUCCESS';
export const ADMIN_USERS_APPROVE_FAIL    = 'ADMIN_USERS_APPROVE_FAIL';

export const ADMIN_USERS_DEACTIVATE_REQUEST = 'ADMIN_USERS_DEACTIVATE_REQUEST';
export const ADMIN_USERS_DEACTIVATE_SUCCESS = 'ADMIN_USERS_DEACTIVATE_SUCCESS';
export const ADMIN_USERS_DEACTIVATE_FAIL    = 'ADMIN_USERS_DEACTIVATE_FAIL';

export const ADMIN_STATUS_DELETE_REQUEST = 'ADMIN_STATUS_DELETE_REQUEST';
export const ADMIN_STATUS_DELETE_SUCCESS = 'ADMIN_STATUS_DELETE_SUCCESS';
export const ADMIN_STATUS_DELETE_FAIL    = 'ADMIN_STATUS_DELETE_FAIL';

export const ADMIN_LOG_FETCH_REQUEST = 'ADMIN_LOG_FETCH_REQUEST';
export const ADMIN_LOG_FETCH_SUCCESS = 'ADMIN_LOG_FETCH_SUCCESS';
export const ADMIN_LOG_FETCH_FAIL    = 'ADMIN_LOG_FETCH_FAIL';

export function fetchConfig() {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_CONFIG_FETCH_REQUEST });
    return api(getState)
      .get('/api/pleroma/admin/config')
      .then(({ data }) => {
        dispatch({ type: ADMIN_CONFIG_FETCH_SUCCESS, configs: data.configs, needsReboot: data.need_reboot });
      }).catch(error => {
        dispatch({ type: ADMIN_CONFIG_FETCH_FAIL, error });
      });
  };
}

export function updateConfig(configs) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_CONFIG_UPDATE_REQUEST, configs });
    return api(getState)
      .post('/api/pleroma/admin/config', { configs })
      .then(({ data: { configs } }) => {
        dispatch({ type: ADMIN_CONFIG_UPDATE_SUCCESS, configs });
      }).catch(error => {
        dispatch({ type: ADMIN_CONFIG_UPDATE_FAIL, error });
      });
  };
}

export function fetchReports(params) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_REPORTS_FETCH_REQUEST, params });
    return api(getState)
      .get('/api/pleroma/admin/reports', { params })
      .then(({ data: { reports } }) => {
        reports.forEach(report => dispatch(importFetchedStatuses(report.statuses)));
        dispatch({ type: ADMIN_REPORTS_FETCH_SUCCESS, reports, params });
      }).catch(error => {
        dispatch({ type: ADMIN_REPORTS_FETCH_FAIL, error, params });
      });
  };
}

function patchReports(ids, state) {
  const reports = ids.map(id => ({ id, state }));
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_REPORTS_PATCH_REQUEST, reports });
    return api(getState)
      .patch('/api/pleroma/admin/reports', { reports })
      .then(() => {
        dispatch({ type: ADMIN_REPORTS_PATCH_SUCCESS, reports });
      }).catch(error => {
        dispatch({ type: ADMIN_REPORTS_PATCH_FAIL, error, reports });
      });
  };
}
export function closeReports(ids) {
  return patchReports(ids, 'closed');
}

export function fetchUsers(params) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_USERS_FETCH_REQUEST, params });
    return api(getState)
      .get('/api/pleroma/admin/users', { params })
      .then(({ data }) => {
        dispatch({ type: ADMIN_USERS_FETCH_SUCCESS, data, params });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_FETCH_FAIL, error, params });
      });
  };
}

export function deactivateUsers(nicknames) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_USERS_DEACTIVATE_REQUEST, nicknames });
    return api(getState)
      .patch('/api/pleroma/admin/users/deactivate', { nicknames })
      .then(({ data: { users } }) => {
        dispatch({ type: ADMIN_USERS_DEACTIVATE_SUCCESS, users, nicknames });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_DEACTIVATE_FAIL, error, nicknames });
      });
  };
}

export function deleteUsers(nicknames) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_USERS_DELETE_REQUEST, nicknames });
    return api(getState)
      .delete('/api/pleroma/admin/users', { data: { nicknames } })
      .then(({ data: nicknames }) => {
        dispatch({ type: ADMIN_USERS_DELETE_SUCCESS, nicknames });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_DELETE_FAIL, error, nicknames });
      });
  };
}

export function approveUsers(nicknames) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_USERS_APPROVE_REQUEST, nicknames });
    return api(getState)
      .patch('/api/pleroma/admin/users/approve', { nicknames })
      .then(({ data: { users } }) => {
        dispatch({ type: ADMIN_USERS_APPROVE_SUCCESS, users, nicknames });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_APPROVE_FAIL, error, nicknames });
      });
  };
}

export function deleteStatus(id) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_STATUS_DELETE_REQUEST, id });
    return api(getState)
      .delete(`/api/pleroma/admin/statuses/${id}`)
      .then(() => {
        dispatch({ type: ADMIN_STATUS_DELETE_SUCCESS, id });
      }).catch(error => {
        dispatch({ type: ADMIN_STATUS_DELETE_FAIL, error, id });
      });
  };
}

export function fetchModerationLog(params) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_LOG_FETCH_REQUEST });
    return api(getState)
      .get('/api/pleroma/admin/moderation_log', { params })
      .then(({ data }) => {
        dispatch({ type: ADMIN_LOG_FETCH_SUCCESS, items: data.items, total: data.total });
        return data;
      }).catch(error => {
        dispatch({ type: ADMIN_LOG_FETCH_FAIL, error });
      });
  };
}
