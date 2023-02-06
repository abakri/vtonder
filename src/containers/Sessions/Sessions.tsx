import { Field, Formik, Form } from 'formik';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import pb from '../../lib/pocketbase';
import { CopyToClipboard } from 'react-copy-to-clipboard';

type SessionType = {
    id: string;
    name: string;
    created: Date;
    updated: Date;
    open: boolean;
}

type NewSessionFormType = {
    name: string;
}

const initialNewSessionData: NewSessionFormType = {
    name: "",
}

type ToggleSessionType = {
    id: string;
    currentOpenState: boolean;
}

export const Sessions: React.FC<{}> = () => {
    const queryClient = useQueryClient();
    const getSessionList = (): Promise<SessionType[]> => {
        return pb.collection('sessions').getFullList(50, { sort: "-created" })
    }
    const { data: sessions, isLoading, error } = useQuery('sessions', getSessionList)

    const { mutate: createSession } = useMutation((data: NewSessionFormType) => {
        return pb.collection('sessions').create({ user: pb.authStore.model?.id, name: data.name, open: true })
    })

    const { mutate: toggleSession } = useMutation((data: ToggleSessionType) => {
        return pb.collection('sessions').update(data.id, { open: !data.currentOpenState })
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('sessions')
        }
    })

    const navigate = useNavigate()

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <div>Unable to load sessions {":("}</div>}
            <div className="flex flex-col ml-8 mt-12 gap-y-10 w-[600PX]">
                <Formik initialValues={initialNewSessionData} onSubmit={(values: NewSessionFormType) => createSession(values)}>
                    <Form className="flex flex-col gap-y-2">
                        <h2>Create new session</h2>
                        <Field type="text" name="name" />
                        <button type="submit">create</button>
                    </Form>
                </Formik>
                {sessions && sessions.map((session: SessionType) => {
                    return (
                        <div className="flex flex-row gap-x-4">
                            <div
                                className="flex justify-center items-center w-full p-4 border-2 border-black text-center h-12 rounded-lg cursor-pointer"
                                key={session.id}
                                onClick={() => navigate(`/${session.id}/form`)}
                            >
                                <p>{session.name}</p>
                            </div>
                            <CopyToClipboard text={`${window.location.host}/${session.id}/form`} onCopy={() => alert("copied to clipboard")}>
                                <div className="flex justify-center items-center w-full p-4 border-2 border-black text-center h-12 rounded-lg cursor-pointer">
                                    Copy form link to clipboard
                                </div>
                            </CopyToClipboard>
                            <label>is open</label>
                            <input type={"checkbox"} checked={session.open} onChange={() => toggleSession({ id: session.id, currentOpenState: session.open })} />
                        </div>
                    )
                })}
            </div>
        </>
    )
}


