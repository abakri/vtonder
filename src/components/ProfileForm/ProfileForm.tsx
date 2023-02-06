import React from "react"
import { useMutation, useQuery } from "react-query"
import pb from "../../lib/pocketbase"
import { Hearts } from "react-loader-spinner"

import { Form, Formik } from 'formik';
import { useParams } from "react-router";
import { ProfileFormValidation } from "../../validation/ProfileFormValidation";
import { SessionType } from "../../types/SessionTypes";
import { Dropzone } from "../SharedComponents/Dropzone";
import { TextInput } from "../SharedComponents/TextInput";
import { TextArea } from "../SharedComponents/TextArea";
import ProfileSubmissionHeader from "../SvgComponents/ProfileSubmissionHeader";
import ProfileFormSubmissionConfirmation from "../SvgComponents/ProfileFormSubmissionConfirmation";

export type PromptType = {
    id: string
    prompt: string
}

export type PromptSubmissionType = {
    prompt: PromptType
    answer: string
}

export const ProfileForm: React.FC = () => {
    const { sessionId } = useParams()
    const getSession = (): Promise<SessionType> => {
        if (!sessionId) throw new Error("No session id")
        return pb.collection("sessions").getOne(sessionId)
    }
    const { data: session, isLoading: loadingSession } = useQuery("session", getSession)

    const getAllPrompts = (): Promise<PromptType[]> => {
        return pb.collection("prompts").getFullList(50, { sort: "created" })
    }
    const useFetchPrompts = () => {
        const queryData = useQuery("prompts", getAllPrompts)
        const data = queryData.data || []
        return { ...queryData, data }
    }
    const { data: prompts, isLoading: loadingPrompts } = useFetchPrompts()

    type ProfileSubmissionFormType = {
        name: string
        age: string
        bio: string
        image1: File | null
        image2: File | null
        image3: File | null
        promptAnswer1: string,
        promptAnswer2: string,
        promptAnswer3: string,
    }

    const initialProfileSubmissionData: ProfileSubmissionFormType = {
        name: "",
        age: "",
        bio: "",
        image1: null,
        image2: null,
        image3: null,
        promptAnswer1: "",
        promptAnswer2: "",
        promptAnswer3: "",
    }

    const uploadImage = async (image: File, profileId: string) => {
        const formData = new FormData()
        formData.append("image", image)
        formData.append("profile", profileId)
        await pb.collection("profile_images").create(formData)
    }
    const uploadPrompts = async (data: ProfileSubmissionFormType, profileId: string,) => {
        await pb.collection("profile_prompts").create({
            profile: profileId,
            answer: data.promptAnswer1,
            prompt: prompts[0].id,
        })
        await pb.collection("profile_prompts").create({
            profile: profileId,
            answer: data.promptAnswer2,
            prompt: prompts[1].id,
        })
        await pb.collection("profile_prompts").create({
            profile: profileId,
            answer: data.promptAnswer3,
            prompt: prompts[2].id,
        })
    }
    const createProfile = async (data: ProfileSubmissionFormType) => {
        const profile = await pb.collection("profiles").create({
            name: data.name,
            age: data.age,
            bio: data.bio,
            session: sessionId,
        })
        await uploadImage(data.image1 as File, profile.id)
        await uploadImage(data.image2 as File, profile.id)
        await uploadImage(data.image3 as File, profile.id)
        await uploadPrompts(data, profile.id)
    }
    const { mutate: submitForm, isLoading: isLoadingFormSubmit, isSuccess: formSubmitSuccess, isError: formSubmitError } = useMutation((data: ProfileSubmissionFormType) => {
        return createProfile(data)
    })

    if (formSubmitSuccess) return (
        <div className="flex flex-col w-full h-screen justify-center items-center pb-10">
            <div className="flex justify-center w-[80%] lg:w-[60%]">
                <ProfileFormSubmissionConfirmation />
            </div>
        </div>
    )
    if (!session?.open) return (
        <div className="flex flex-col w-full h-screen justify-center items-center pb-10">
            <p className="text-[#ff5191] font-fredoka text-2xl">sorry! submissions are closed! {":_>"}</p>
        </div>
    )
    if (loadingPrompts || loadingSession) return (
        <div className="flex flex-col w-full h-screen justify-center items-center pb-10">
            <Hearts
                height="80"
                width="80"
                color="#ff5191"
                ariaLabel="hearts-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    )
    if (isLoadingFormSubmit) return (
        <div className="flex flex-col w-full h-screen justify-center items-center pb-10">
            <Hearts
                height="80"
                width="80"
                color="#ff5191"
                ariaLabel="hearts-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
            <p className="text-[#ff5191] font-fredoka text-lg">submitting your profile...</p>
        </div>
    )
    return (
        <div className="flex flex-col justify-center items-center w-screen">
            <div className="flex justify-center items-center w-[80%] sm:w-[450px] mt-8">
                <ProfileSubmissionHeader />
            </div>
            <Formik initialValues={initialProfileSubmissionData} validationSchema={ProfileFormValidation} onSubmit={(values) => { submitForm(values) }} validateOnBlur={false} validateOnChange={false}>
                {({ setFieldValue, errors, touched, values }) => (
                    <Form className="flex flex-col gap-y-6 w-full sm:w-[450px] pb-[120px] px-4 sm:px-0 items-center">
                        <TextInput label="Name" name="name" error={errors.name} onChange={(value) => setFieldValue("name", value)} />
                        <TextInput label="Age" name="age" error={errors.age} onChange={(value) => setFieldValue("age", value)} />
                        <TextArea label="Bio" name="bio" error={errors.bio} placeholder="Tell us about yourself!" onChange={(value) => setFieldValue("bio", value)} />

                        <div className="flex flex-col w-full sm:flex-row gap-x-2 gap-y-4 sm:gap-y-0 items-center justify-center">
                            <Dropzone label="Image 1" name="image1" value={values.image1} error={touched.image1 && errors.image1 ? errors.image1 : undefined} onDrop={(files) => { if (files.length > 0) setFieldValue("image1", files[0]) }} />
                            <Dropzone label="Image 2" name="image2" value={values.image2} error={touched.image2 && errors.image2 ? errors.image2 : undefined} onDrop={(files) => { if (files.length > 0) setFieldValue("image2", files[0]) }} />
                            <Dropzone label="Image 3" name="image3" value={values.image3} error={touched.image3 && errors.image3 ? errors.image3 : undefined} onDrop={(files) => { if (files.length > 0) setFieldValue("image3", files[0]) }} />
                        </div>

                        <TextArea label={prompts[0].prompt} name="promptAnswer1" error={errors.promptAnswer1} placeholder="Your response here!" onChange={(value) => setFieldValue("promptAnswer1", value)} />
                        <TextArea label={prompts[1].prompt} name="promptAnswer2" error={errors.promptAnswer2} placeholder="Your response here!" onChange={(value) => setFieldValue("promptAnswer2", value)} />
                        <TextArea label={prompts[2].prompt} name="promptAnswer3" error={errors.promptAnswer3} placeholder="Your response here!" onChange={(value) => setFieldValue("promptAnswer3", value)} />

                        {formSubmitError && <div className="text-[#ff5c98] text-sm">Error while submitting form</div>}
                        <button
                            className="font-fredoka text-[#ff4589] w-1/2 h-[50px] border-[3px] border-[#ff5c98] transition hover:bg-[#ff5c98] bg-[#ffe0e8] rounded-lg hover:text-white"
                            style={{
                                boxShadow: "6px 6px 0px #ff5c98"
                            }}
                            type="submit"
                            disabled={isLoadingFormSubmit}
                        >
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}
