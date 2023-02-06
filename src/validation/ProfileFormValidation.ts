import * as Yup from 'yup';

export const ProfileFormValidation = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    age: Yup.number().min(18).required('Age is required'),
    bio: Yup.string().required('Bio is required'),
    image1: Yup.mixed<File | null>().test("isSmallEnough", "File must be less than 30mb", file => !file || file.size < 31_457_280).required('Image is required'),
    image2: Yup.mixed<File | null>().test("isSmallEnough", "File must be less than 30mb", file => !file || file.size < 31_457_280).required('Image is required'),
    image3: Yup.mixed<File | null>().test("isSmallEnough", "File must be less than 30mb", file => !file || file.size < 31_457_280).required('Image is required'),
    promptAnswer1: Yup.string().required('Prompt response is required'),
    promptAnswer2: Yup.string().required('Prompt response is required'),
    promptAnswer3: Yup.string().required('Prompt response is required'),
});