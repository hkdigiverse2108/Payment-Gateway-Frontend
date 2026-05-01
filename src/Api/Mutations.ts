import { KEYS, URL_KEYS } from "../Constants";
import type {
    LoginPayload,
    LoginResponse,
    MessageStatus,
    ResetPasswordPayload,
    UpdateUserPayload,
    UserApiResponse,
} from "../Types";

import { Post, Put } from "./Method";
import { useMutations } from "./ReactQuery";

export const Mutations = {

    useLogin: () =>
        useMutations<LoginPayload, LoginResponse>(
            [KEYS.AUTH.LOGIN],
            (input) => Post(URL_KEYS.AUTH.LOGIN, input, false)
        ),
    useUpdateUser: () => useMutations<UpdateUserPayload, UserApiResponse>([KEYS.USER.UPDATE, KEYS.USER.BASE], (input) => Put(URL_KEYS.USER.UPDATE, input)),

    useUpdateProfile: () => useMutations<UpdateUserPayload, UserApiResponse>([KEYS.USER.UPDATE_PROFILE, KEYS.USER.BASE], (input) => Put(URL_KEYS.USER.UPDATE_PROFILE, input)),

    useResetPassword: () => useMutations<ResetPasswordPayload, MessageStatus>([KEYS.AUTH.CHANGE_PASSWORD], (input) => Post(URL_KEYS.AUTH.CHANGE_PASSWORD, input)),
};
