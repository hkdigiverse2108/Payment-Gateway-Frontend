import { KEYS, URL_KEYS } from "../Constants";
import type { AddUserPayload, LoginPayload, LoginResponse, MessageStatus, ResetPasswordPayload, UpdateUserPayload, UserApiResponse } from "../Types";
import { Delete, Post, Put } from "./Method";
import { useMutations } from "./ReactQuery";

export const Mutations = {
    //auth
    useLogin: () => useMutations<LoginPayload, LoginResponse>([KEYS.AUTH.LOGIN], (input) => Post(URL_KEYS.AUTH.LOGIN, input, false)),
    useResetPassword: () => useMutations<ResetPasswordPayload, MessageStatus>([KEYS.AUTH.CHANGE_PASSWORD], (input) => Post(URL_KEYS.AUTH.CHANGE_PASSWORD, input)),

    // user
    useAddUser: () => useMutations<AddUserPayload, void>([KEYS.USER.ADD, KEYS.USER.BASE], (input) => Post(URL_KEYS.USER.ADD, input)),
    useUpdateUser: () => useMutations<UpdateUserPayload, UserApiResponse>([KEYS.USER.UPDATE, KEYS.USER.BASE], (input) => Put(URL_KEYS.USER.UPDATE, input)),
    useDeleteUser: () => useMutations<string, void>([KEYS.USER.DELETE, KEYS.USER.BASE], (id) => Delete(`${URL_KEYS.USER.BASE}/${id}`)),
    useUpdateProfile: () => useMutations<UpdateUserPayload, UserApiResponse>([KEYS.USER.UPDATE_PROFILE, KEYS.USER.BASE], (input) => Put(URL_KEYS.USER.UPDATE_PROFILE, input)),
};
