import React, { useEffect, useRef } from 'react'
import { TiTimes, TiHeart, TiStarFullOutline} from 'react-icons/ti'
import { Choice } from '../../static/Choice'
import { ProfileImageType, ProfileType } from '../../types/ProfileTypes'
import { ImageModal } from '../ImageModal/ImageModal';
import NiceModal from '@ebay/nice-modal-react';

type ProfileProps = {
    profile: ProfileType
    currentPage: number
    isCurrentPage: boolean
    choice?: Choice
    onChoice?: (choice: Choice) => void
}
export const Profile: React.FC<ProfileProps> = ({ profile, choice, onChoice, currentPage, isCurrentPage }) => {
    const { age, name, bio, images, prompts } = profile
    const scrollable = useRef<HTMLDivElement>(null)

    const getImageUrl = (image: ProfileImageType): string => {
        return `https://server.vtonder.com/api/files/profile_images/${image.id}/${image.filename}`
    }
    const profileChoice = choice || Choice.undecided
    const dislikeStyling = profileChoice === Choice.dislike ? "bg-red-500 text-white" : ""
    const likeStyling = profileChoice === Choice.like ? "bg-pink-300 text-white" : ""
    const superlikeStyling = profileChoice === Choice.superlike ? "bg-blue-300 text-white" : ""

    const renderChoice = () => {
        if (choice == Choice.undecided) return null
        else if (choice == Choice.like) return <TiHeart className="text-red-500 mr-4 text-3xl" />
        else if (choice == Choice.dislike) return <TiTimes className="text-red-500 mr-4 text-3xl" />
        else if (choice == Choice.superlike) return <TiStarFullOutline className="text-blue-500 mr-4 text-3xl" />
    }
        
    useEffect(() => {
        if (scrollable.current && isCurrentPage) {
            scrollable.current.scrollTo(0, 0)
        }
    }, [isCurrentPage])

    const clickLike = () => {
        if (choice === Choice.like) onChoice?.(Choice.undecided)
        else onChoice?.(Choice.like)
    }

    const clickDislike = () => {
        if (choice === Choice.dislike) onChoice?.(Choice.undecided)
        else onChoice?.(Choice.dislike)
    }

    const clickSuperlike = () => {
        if (choice === Choice.superlike) onChoice?.(Choice.undecided)
        else onChoice?.(Choice.superlike)
    }


    const openModal = (imageUrl: string) => {
        NiceModal.show(ImageModal, { src: imageUrl, alt: "profile"})
    }

    return (
        <div className="transform flex flex-col items-center min-w-full max-w-full scrollbar-hide overflow-y-scroll pt-2 px-2 pb-16 sm:p-8 gap-y-4 transition-transform duration-500" style={{ transform: `translateX(${-100 * currentPage}%)` }} ref={scrollable}>
            <div className="rounded-3xl bg-white w-full">
                <div className="flex items-center">
                    <h1 className="justify-self-start text-2xl font-bold w-full pt-6 px-6 pb-[20px] font-fredoka">{name} <span className="text-lg font-semibold">{age}</span></h1>
                    {renderChoice()}
                </div>
                <img className="object-cover h-[365px] w-full bg-white" src={getImageUrl(images[0])} alt={name} onClick={() => openModal(getImageUrl(images[0]))} />
                <div className="w-full px-6 py-[30px]">
                    <p className="text-lg font-fredoka">{bio}</p>
                </div>
            </div>
            <img className="object-cover h-[365px] w-full rounded-3xl bg-white" src={getImageUrl(images[1])} alt={name} onClick={() => openModal(getImageUrl(images[1]))} />

            <div className="flex flex-col gap-y-2 w-full px-6 py-[70px] rounded-3xl bg-white">
                <h1 className="text-lg font-fredoka">{prompts[0].prompt}</h1>
                <p className="font-semibold text-2xl font-fredoka">{prompts[0].answer}</p>
            </div>
            <img className="object-cover h-[365px] w-full rounded-3xl bg-white" src={getImageUrl(images[2])} alt={name} onClick={() => openModal(getImageUrl(images[2]))} />
            <div className="flex flex-col gap-y-2 w-full px-6 py-[70px] rounded-3xl bg-white">
                <h1 className="text-lg font-fredoka">{prompts[1].prompt}</h1>
                <p className="font-semibold text-2xl font-fredoka">{prompts[1].answer}</p>
            </div>
            <div className="flex flex-col gap-y-2 w-full px-6 py-[70px] rounded-3xl bg-white">
                <h1 className="text-lg font-fredoka">{prompts[2].prompt}</h1>
                <p className="font-semibold text-2xl font-fredoka">{prompts[2].answer}</p>
            </div>
            <div className="flex flex-row w-full justify-between items-center px-[15%] m-8">
                <button
                    className={`flex justify-center items-center bg-white border-4 border-black rounded-full text-[80px] select-none scale-100 transition ${dislikeStyling}`}
                    onClick={clickDislike}
                >
                    <TiTimes />
                </button>
                {
                <button
                    className={`flex justify-center items-center bg-white border-4 border-black rounded-full text-[80px] select-none scale-100 transition ${superlikeStyling}`}
                    onClick={clickSuperlike}
                >
                    <TiStarFullOutline />
                </button>
                }
                <button
                    className={`flex justify-center items-center bg-white border-4 border-black rounded-full text-[80px] select-none scale-100 transition ${likeStyling}`}
                    onClick={clickLike}
                >
                    <TiHeart />
                </button>
            </div>
        </div>
    )
}
