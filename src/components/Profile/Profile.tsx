import React, { useEffect, useState, useRef } from 'react'
import { TiTimes, TiHeart, TiStarFullOutline } from 'react-icons/ti'
import { Choice } from '../../static/choice'
import { ProfileImage, ProfileType } from '../../types/ProfileTypes'
import { ImageModal } from '../ImageModal/ImageModal';
import NiceModal from '@ebay/nice-modal-react';

import { useMutation, useQueryClient } from "react-query"

import { getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

type ProfileProps = {
  profile: ProfileType
  currentPage: number
  isCurrentPage: boolean
}

export const Profile: React.FC<ProfileProps> = ({ profile, currentPage, isCurrentPage }) => {
  const queryClient = useQueryClient()

  const { id, age, choice, name, bio, images, prompts, session } = profile
  const [currentChoice, setCurrentChoice] = useState<Choice>(choice || Choice.undecided)
  const [imageUrls, setImageUrls] = useState<string[]>(new Array(images.length).fill(""))

  const scrollable = useRef<HTMLDivElement>(null)

  async function getImageUrl(image: ProfileImage): Promise<string> {
    const imageRef = ref(storage, image.storageLocation);
    try {
      return await getDownloadURL(imageRef);
    } catch (error) {
      return "";
    }
  }

  const dislikeStyling = currentChoice === Choice.dislike ? "bg-red-500 text-white" : ""
  const likeStyling = currentChoice === Choice.like ? "bg-pink-300 text-white" : ""
  const superlikeStyling = currentChoice === Choice.superlike ? "bg-blue-300 text-white" : ""

  const updateProfileDecision = async (profileId: string, choice: Choice) => {
    const ref = doc(db, "profiles", profileId);
    await updateDoc(ref, { choice: choice });
  }

  const {
    mutate: setProfileChoice,
  } = useMutation({
    mutationFn: (data: { profileId: string, choice: Choice }) => {
      const { profileId, choice } = data
      return updateProfileDecision(profileId, choice)
    },
    onSuccess: (data) => {
      queryClient.setQueryData([`profiles-for-session-${session}`, { id }], data)
      // queryClient.invalidateQueries({queryKey: [`profiles-for-session-${session}`]})
    }
  })

  const renderChoice = () => {
    if (currentChoice == Choice.undecided || !choice) return null
    else if (currentChoice == Choice.like) return <TiHeart className="text-red-500 mr-4 text-3xl" />
    else if (currentChoice == Choice.dislike) return <TiTimes className="text-red-500 mr-4 text-3xl" />
    else if (currentChoice == Choice.superlike) return <TiStarFullOutline className="text-blue-500 mr-4 text-3xl" />
  }

  useEffect(() => {
    if (scrollable.current && isCurrentPage) {
      scrollable.current.scrollTo(0, 0)
    }
  }, [isCurrentPage])

  useEffect(() => {
    const getImages = async () => {
      const urls = await Promise.all(images.map(async (image) => {
        return await getImageUrl(image)
      }))
      setImageUrls(urls)
    }
    getImages()
  }, [images])

  const clickLike = () => {
    setCurrentChoice(Choice.like)
    setProfileChoice({ profileId: id, choice: Choice.like })
  }

  const clickDislike = () => {
    setCurrentChoice(Choice.dislike)
    setProfileChoice({ profileId: id, choice: Choice.dislike })
  }

  const clickSuperlike = () => {
    setCurrentChoice(Choice.superlike)
    setProfileChoice({ profileId: id, choice: Choice.superlike })
  }


  const openModal = (imageUrl: string) => {
    NiceModal.show(ImageModal, { src: imageUrl, alt: "profile" })
  }

  return (
    <div className="transform flex flex-col items-center min-w-full max-w-full scrollbar-hide overflow-y-scroll pt-2 px-2 pb-16 sm:p-8 gap-y-4 transition-transform duration-500" style={{ transform: `translateX(${-100 * currentPage}%)` }} ref={scrollable}>
      <div className="rounded-3xl bg-white w-full">
        <div className="flex items-center">
          <h1 className="justify-self-start text-theme-primary text-2xl font-bold w-full pt-6 px-6 pb-[20px] font-fredoka">{name} <span className="text-theme-primary text-lg font-semibold">{age}</span></h1>
          {renderChoice()}
        </div>
        <img className="object-cover h-[365px] w-full bg-white" src={imageUrls[0]} alt={name} onClick={() => openModal(imageUrls[0])} /> <div className="w-full px-6 py-[30px]"> <p className="text-theme-primary text-lg font-fredoka">{bio}</p> </div> </div>
      <img className="object-cover h-[365px] w-full rounded-3xl bg-white" src={imageUrls[1]} alt={name} onClick={() => openModal(imageUrls[1])} />

      <div className="flex flex-col gap-y-2 w-full px-6 py-[70px] rounded-3xl bg-white">
        <h1 className="text-lg text-theme-primary font-fredoka">{prompts[0].prompt}</h1>
        <p className="text-theme-primary font-semibold text-2xl font-fredoka">{prompts[0].answer}</p>
      </div>
      <img className="object-cover h-[365px] w-full rounded-3xl bg-white" src={imageUrls[2]} alt={name} onClick={() => openModal(imageUrls[2])} />
      <div className="flex flex-col gap-y-2 w-full px-6 py-[70px] rounded-3xl bg-white">
        <h1 className="text-theme-primary text-lg font-fredoka">{prompts[1].prompt}</h1>
        <p className="text-theme-primary font-semibold text-2xl font-fredoka">{prompts[1].answer}</p>
      </div>
      <div className="flex flex-col gap-y-2 w-full px-6 py-[70px] rounded-3xl bg-white">
        <h1 className="text-theme-primary text-lg font-fredoka">{prompts[2].prompt}</h1>
        <p className="text-theme-primary font-semibold text-2xl font-fredoka">{prompts[2].answer}</p>
      </div>
      <div className="flex flex-row w-full justify-between items-center px-[15%] m-8">
        <button
          className={`flex justify-center items-center bg-white border-4 border-theme-choice rounded-full text-theme-primary text-[80px] select-none scale-100 transition ${dislikeStyling}`}
          onClick={clickDislike}
        >
          <TiTimes />
        </button>
        {
          <button
            className={`flex justify-center items-center bg-white border-4 border-theme-choice rounded-full text-theme-primary text-[80px] select-none scale-100 transition ${superlikeStyling}`}
            onClick={clickSuperlike}
          >
            <TiStarFullOutline />
          </button>
        }
        <button
          className={`flex justify-center items-center bg-white border-4 border-theme-choice rounded-full text-theme-primary text-[80px] select-none scale-100 transition ${likeStyling}`}
          onClick={clickLike}
        >
          <TiHeart />
        </button>
      </div>
    </div>
  )
}
