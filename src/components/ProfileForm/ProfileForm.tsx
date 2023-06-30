import React from "react"
import { useMutation, useQuery } from "react-query"
import { Hearts } from "react-loader-spinner"

import { Form, Formik } from 'formik';
import { useParams } from "react-router";
import { ProfileFormValidation } from "../../validation/ProfileFormValidation";
import { Dropzone } from "../SharedComponents/Dropzone";
import { TextInput } from "../SharedComponents/TextInput";
import { TextArea } from "../SharedComponents/TextArea";
import ProfileSubmissionHeader from "../SvgComponents/ProfileSubmissionHeader";
import ProfileFormSubmissionConfirmation from "../SvgComponents/ProfileFormSubmissionConfirmation";
import { storage } from "../../lib/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { SUBMIT_PROFILE_URL } from "../../static/constants";
import { getSessionById } from "../../repositories/session.repository";

export type PromptSubmissionType = {
  prompt: string
  answer: string
}

export const ProfileForm: React.FC = () => {
  const { sessionId } = useParams()

  const {
    data: session,
    isLoading: loadingSession,
  } = useQuery("session", () => getSessionById(sessionId));

  type ProfileSubmissionFormType = {
    name: string
    age: string
    bio: string
    social: string
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
    social: "",
    image1: null,
    image2: null,
    image3: null,
    promptAnswer1: "",
    promptAnswer2: "",
    promptAnswer3: "",
  }

  async function uploadImage(image: File): Promise<string> {
    const storageLocation = `profileImages/${image.name}`;
    const imageRef = ref(storage, storageLocation);
    await uploadBytes(imageRef, image);
    return storageLocation;
  }

  const submitProfile = async (data: ProfileSubmissionFormType) => {
    const {
      name,
      age,
      bio,
      social,
      promptAnswer1,
      promptAnswer2,
      promptAnswer3,
    } = data;

    // TODO: Image uploading should happen when they choose the image.
    // It should be deleted if they x out the form without submitting or they remove them image.
    const imageLocation1 = await uploadImage(data.image1 as File);
    const imageLocation2 = await uploadImage(data.image2 as File);
    const imageLocation3 = await uploadImage(data.image3 as File);
    const requestBody = {
      name,
      age,
      bio,
      social,
      sessionId,
      imageLocation1,
      imageLocation2,
      imageLocation3,
      promptAnswer1,
      promptAnswer2,
      promptAnswer3,
    };

    const response = await fetch(SUBMIT_PROFILE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error("Failed to submit profile");
  }

  const {
    mutate: submitForm,
    isLoading: isLoadingFormSubmit,
    isSuccess: formSubmitSuccess,
    isError: formSubmitError,
  } = useMutation((data: ProfileSubmissionFormType) => submitProfile(data));

  if (formSubmitSuccess) return (
    <div className="flex flex-col w-full h-screen justify-center items-center pb-10" >
      <div className="flex justify-center w-[80%] lg:w-[60%]">
        <ProfileFormSubmissionConfirmation />
      </div>
    </div >
  )
  if (!session?.open) return (
    <div className="flex flex-col w-full h-screen justify-center items-center pb-10">
      <p className="text-[#ff5191] font-fredoka text-2xl">sorry! submissions are closed! {":_>"}</p>
    </div>
  )
  if (loadingSession) return (
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

            <TextArea label={session?.prompts[0]} name="promptAnswer1" error={errors.promptAnswer1} placeholder="Your response here!" onChange={(value) => setFieldValue("promptAnswer1", value)} />
            <TextArea label={session?.prompts[1]} name="promptAnswer2" error={errors.promptAnswer2} placeholder="Your response here!" onChange={(value) => setFieldValue("promptAnswer2", value)} />
            <TextArea label={session?.prompts[2]} name="promptAnswer3" error={errors.promptAnswer3} placeholder="Your response here!" onChange={(value) => setFieldValue("promptAnswer3", value)} />

            <TextInput label="Twitter @" name="social" error={errors.social} onChange={(value) => setFieldValue("social", value)} />

            {formSubmitError && <div className="text-[#ff5c98] text-sm">Error while submitting form</div>}
            <button
              className="font-fredoka text-[#ff4589] w-1/2 h-[50px] border-[3px] border-[#ff5c98] transition hover:bg-[#ff5c98] bg-[#ffe0e8] rounded-lg hover:text-white"
              style={{
                boxShadow: "6px 6px 0px #ff5c98"
              }}
              type="submit"
              disabled={isLoadingFormSubmit || session == undefined || session == null}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
