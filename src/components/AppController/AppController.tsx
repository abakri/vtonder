import React, { useMemo, useState } from "react";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useParams } from "react-router";
import pb from "../../lib/pocketbase";
import { useQuery } from "react-query";
import { ProfileType } from "../../types/ProfileTypes";
import { Profile } from "../Profile/Profile";
import { Choice } from "../../static/Choice";
import { TiBatteryLow } from "react-icons/ti";
import { FaChevronLeft, FaChevronRight, FaWifi } from "react-icons/fa";
import { MdOutlineSignalCellularAlt } from "react-icons/md";
import { Logo } from "../SvgComponents/VTonderLogo";

export type FetchedPrompt = {
  prompt: { prompt: string }
}

export type FetchedProfileImage = {
  id: string
  image: string;
}

export type FetchedProfilePrompt = {
  answer: string;
  expand: FetchedPrompt;
}

export type FetchedProfileRelatedData = {
  "profile_images(profile)": FetchedProfileImage[];
  "profile_prompts(profile)": FetchedProfilePrompt[];
}

export type FetchedProfile = {
  id: string
  choice: Choice | null
  age: string
  bio: string
  name: string
  session: string
  expand: FetchedProfileRelatedData
}

export const AppController: React.FC = ({ }) => {

  const { sessionId } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filter, setFilter] = useState<string>('all');

  // fetch profiles
  const getProfilesForSession = (): Promise<FetchedProfile[]> => {
    return pb.collection("profiles").getFullList(200, {
      sort: "created",
      filter: `session.id = "${sessionId}"`,
      expand: "profile_images(profile),profile_prompts(profile).prompt",
    })
  }

  // helper to transorm fetched profiles into internal profiles
  const transformProfiles = (profiles: FetchedProfile[] | undefined): ProfileType[] => {
    if (!profiles) return []
    return profiles.map((data: FetchedProfile) => {
      return {
        id: data.id,
        name: data.name,
        choice: data.choice as Choice,
        bio: data.bio,
        age: data.age,
        session: data.session,
        images: data.expand["profile_images(profile)"].map(image => ({ id: image.id, filename: image.image })),
        prompts: data.expand["profile_prompts(profile)"].map(prompt => {
          return {
            prompt: prompt.expand.prompt.prompt,
            answer: prompt.answer,
          }
        })
      }
    })
  }


  const useSessionProfileQuery = () => {
    let queryInfo = useQuery(`profiles-for-session-${sessionId}`, getProfilesForSession)
    const data = useMemo(() => transformProfiles(queryInfo.data), [queryInfo.data])
    return { ...queryInfo, data }
  }

  const filterProfiles = (profiles: ProfileType[]): ProfileType[] => {
    setCurrentPage(0); // reset page to the beginning
    if (filter === 'all') return profiles;
    if (filter === 'like') return profiles.filter(profile => profile.choice === Choice.like || profile.choice === Choice.superlike);
    if (filter === 'superlike') return profiles.filter(profile => profile.choice === Choice.superlike);
    if (filter === 'dislike') return profiles.filter(profile => profile.choice === Choice.dislike);
    return profiles
  }

  const { data: profiles, isLoading, isError, isSuccess } = useSessionProfileQuery()
  const filteredProfiles = useMemo(() => filterProfiles(profiles || []), [profiles, filter]) // only update filtered profiles when profiles is updated

  const nextProfile = () => {
    if (profiles && currentPage < filteredProfiles.length - 1) setCurrentPage(currentPage + 1);
  }
  const previousProfile = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  }

  const renderProfiles = () => {
    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error</div>
    if (!profiles) return <div>No profiles</div>
    if (isSuccess) {
      if (!filteredProfiles.length) return <div>No profiles</div>
      return filteredProfiles.map((profile, index) => {
        return (
          <Profile
            key={profile.id}
            currentPage={currentPage}
            isCurrentPage={index === currentPage}
            profile={profile}
          />
        )
      })
    }
  }


  return (
    <div className="w-screen h-screen bg-white">
      <div className="flex justify-center items-center w-screen h-screen bg-white">
        <button className="flex justify-center items-center rounded-2xl border-4 w-16 h-16 bg-[#fff5f7] border-[#ffd1dc] text-4xl text-[#ff9cb4]" onClick={previousProfile}>
          <FaChevronLeft className="-translate-x-[2px]" />
        </button>

        {/* sound buttons */}
        <div className="flex mb-[470px] flex-col gap-y-4 h-[170px] w-[16px] overflow-hidden">
          <div className="grow w-full bg-[#ffd1dc] rounded-lg translate-x-[8px]" />
          <div className="grow w-full bg-[#ffd1dc] rounded-lg translate-x-[8px]" />
        </div>

        {/* phone */}
        <div className="flex flex-col w-full h-full sm:w-[550px] sm:h-[952px] sm:border-[10px] sm:border-[#ffd1dc] sm:rounded-[32px] transition overflow-hidden">
          <div className="flex h-[72px] border-b-4 border-[#ffd1dc] bg-[#fff5f7]">
            <div className="basis-1/3 w-full"></div>
            <div className="grow flex justify-center items-center w-full font-fredoka font-semibold text-[50px] text-[#ff9cb4] translate-x-2">
              <Logo />
            </div>
            <div className="basis-1/3 flex flex-row justify-end items-center py-4 pr-4 gap-x-3">
              <MdOutlineSignalCellularAlt className="text-[24px] text-[#ffd1dc]" />
              <FaWifi className="text-[24px] text-[#ffd1dc]" />
              <TiBatteryLow className="text-[34px] text-[#ffd1dc] -translate-y-[1px]" />
            </div>
          </div>

          {/* mask bounds for profiles */}
          <div className="flex flex-row overflow-hidden bg-[#fff5f7]">
            {renderProfiles()}
          </div>
        </div>


        {/* power button */}
        <div className="flex mb-[490px] flex-col gap-y-4 h-[110px] w-[16px] overflow-hidden">
          <div className="w-full h-full bg-[#ffd1dc] rounded-lg -translate-x-[8px]" />
        </div>

        <button className="flex justify-center items-center rounded-2xl border-4 w-16 h-16 bg-[#fff5f7] border-[#ffd1dc] text-4xl text-[#ff9cb4]" onClick={nextProfile}>
          <FaChevronRight className="=translate-x-[2px]" />
        </button>

        <Dropdown options={['all', 'like', 'superlike', 'dislike']} value={'all'} onChange={({value}) => setFilter(value)} />
      </div>
    </div>

  )
};
