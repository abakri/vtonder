import React, { useMemo, useState, useEffect } from "react";
import 'react-dropdown/style.css';
import { useParams } from "react-router";
import { useQuery } from "react-query";
import { ProfileType } from "../../types/ProfileTypes";
import { Profile } from "../Profile/Profile";
import { TiBatteryLow } from "react-icons/ti";
import { FaChevronLeft, FaChevronRight, FaWifi } from "react-icons/fa";
import { MdOutlineSignalCellularAlt } from "react-icons/md";
import { Logo } from "../SvgComponents/VTonderLogo";
import { getProfilesForSessionFromFirebase } from "../../repositories/profile.repository";
import { Choice } from "../../static/choice";
import { getSessionById } from "../../repositories/session.repository";
import Select from "react-select";
import { Hearts } from "react-loader-spinner";

enum Filter {
  all = 'all',
  like = 'like',
  superlike = 'superlike',
  dislike = 'dislike',
}

const filteringOptions = [
  { value: Filter.all, label: 'Show All' },
  { value: Filter.like, label: 'Liked' },
  { value: Filter.superlike, label: 'Superliked' },
  { value: Filter.dislike, label: 'Disliked' },
]

const filterToChoiceMapping = {
  [Filter.all]: Object.values(Choice),
  [Filter.like]: [Choice.like, Choice.superlike],
  [Filter.superlike]: [Choice.superlike],
  [Filter.dislike]: [Choice.dislike],
}

export const AppController: React.FC = ({ }) => {
  const { sessionId } = useParams();
  if (!sessionId) return (<div>no session id</div>);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentFilter, setCurrentFilter] = useState<Filter>(Filter.all);

  const [localProfiles, setLocalProfiles] = useState<ProfileType[]>([]);

  const updateLocalProfileDecision = (profileId: string, choice: Choice) => {
    // We pass this function to the Profile component so that it can update the localProfiles state.
    // This is so that we can update the choice of a profile without having to refetch the entire list of profiles.
    // When someone makes a decision on the profile:
    // - If the current filter should still show that profile, then don't do anything, just update the choice locally.
    // - If the current filter should not show that profile, then it should disappear, and we show the next available profile.
    //     - If it was the last profile, then we show the previous profile.
    //     - If it was not the last profile, then we show the next profile.

    var newCurrentPage = currentPage;

    // Check if the current filter does not show the profile
    if (!filterToChoiceMapping[currentFilter].includes(choice)) {
      // Check if the profile is the last profile
      if (currentPage === filteredProfiles.length - 1) {
        // If it is the last profile, then show the previous profile
        newCurrentPage = currentPage - 1
      }
      // TODO: If it goes to the next profile, we should have some sort of animation to show that the profile is disappearing, 
      // and the next profile is appearing.
    }

    const updatedProfiles = localProfiles.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          choice: choice,
        }
      }
      return profile;
    })
    setLocalProfiles(updatedProfiles);
    setCurrentPage(newCurrentPage);
  }

  const updateFilter = (filter: Filter) => {
    if (filter === currentFilter) return;
    setCurrentPage(0);
    setCurrentFilter(filter);
  }

  const filterProfiles = (filter: Filter, profiles: ProfileType[]): ProfileType[] => {
    return profiles.filter(profile => filterToChoiceMapping[filter].includes(profile.choice));
  }

  const {
    data: session,
  } = useQuery("session", () => getSessionById(sessionId));

  const theme = session?.theme || 'theme-base';

  const {
    data: profiles,
    isLoading,
    isError,
    isSuccess,
  } = useQuery(`profiles-for-session-${sessionId}`, () => getProfilesForSessionFromFirebase(sessionId));

  useEffect(() => {
    setLocalProfiles(profiles || []);
  }, [profiles])

  const filteredProfiles = useMemo(() => filterProfiles(currentFilter, localProfiles), [localProfiles, currentFilter]) // only update filtered profiles when profiles is updated

  const nextProfile = () => {
    if (profiles && currentPage < filteredProfiles.length - 1) setCurrentPage(currentPage + 1);
  }
  const previousProfile = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  }

  const renderProfiles = () => {
    if (isLoading) return (
      <div className="w-full h-full flex flex-col justify-center items-center font-fredoka text-[24px]">
        <div>
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
        <div>Loading...</div>
      </div>
    )
    if (isError) return <div className="w-full h-full flex justify-center items-center font-fredoka text-[24px]">Error</div>
    if (!profiles || (isSuccess && !filteredProfiles.length)) return <div className="w-full h-full flex justify-center items-center font-fredoka text-[24px]">No profiles</div>
    if (isSuccess) {
      return filteredProfiles.map((profile, index) => {
        return (
          <Profile
            key={profile.id}
            currentPage={currentPage}
            isCurrentPage={index === currentPage}
            profile={profile}
            updateLocalProfileDecision={updateLocalProfileDecision}
          />
        )
      })
    }
  }

  if (!session) return (
    <div className="flex justify-center items-center w-screen h-screen text-[32px] font-fredoka">
      <div>Loading...</div>
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

  return (
    <div className={theme}>
      <div className="flex justify-center items-center w-screen h-screen bg-gradient-45 from-gradstart to-gradend">
        <button
          className="flex justify-center items-center rounded-2xl border-4 w-16 h-16 bg-theme-muted border-theme-primary text-4xl text-theme-outline"
          onClick={previousProfile}
        >
          <FaChevronLeft className="-translate-x-[2px]" />
        </button>

        {/* sound buttons */}
        <div className="flex mb-[470px] flex-col gap-y-4 h-[170px] w-[16px] overflow-hidden">
          <div className="grow w-full bg-border rounded-lg translate-x-[8px]" />
          <div className="grow w-full bg-theme-primary rounded-lg translate-x-[8px]" />
        </div>

        {/* phone */}
        <div className="flex flex-col w-full h-full sm:w-[550px] sm:h-[952px] sm:border-[10px] sm:border-theme-primary sm:rounded-[32px] transition overflow-hidden">
          <div className="flex h-[72px] border-b-2 border-theme-secondary bg-theme-muted">
            <div className="basis-1/3 w-full"></div>
            <div className="grow flex justify-center items-center w-full font-fredoka font-semibold text-[50px] text-theme-outline translate-x-2">
              <Logo />
            </div>
            <div className="basis-1/3 flex flex-row justify-end items-center py-4 pr-4 gap-x-3">
              <MdOutlineSignalCellularAlt className="text-[24px] text-theme-icon" />
              <FaWifi className="text-[24px] text-theme-icon" />
              <TiBatteryLow className="text-[34px] text-theme-icon -translate-y-[1px]" />
            </div>
          </div>

          {/* mask bounds for profiles */}
          <div className="w-full h-full flex flex-row overflow-hidden bg-theme-muted">
            {renderProfiles()}
          </div>
        </div>


        {/* power button */}
        <div className="flex mb-[490px] flex-col gap-y-4 h-[110px] w-[16px] overflow-hidden">
          <div className="w-full h-full bg-theme-outline rounded-lg -translate-x-[8px]" />
        </div>

        <button className="flex justify-center items-center rounded-2xl border-4 w-16 h-16 bg-theme-muted border-theme-primary text-4xl text-theme-outline" onClick={nextProfile}>
          <FaChevronRight className="=translate-x-[2px]" />
        </button>

        <div className="absolute top-0 right-0 mt-4 mr-4 w-[200px]">
          <Select
            options={filteringOptions}
            defaultValue={filteringOptions[0]}
            styles={{
              control: (provided, _) => ({
                ...provided,
                color: 'var(--color-text-primary)',
                fontFamily: 'Fredoka',
                boxShadow: 'none',
              }),
              option: (provided, state) => ({
                ...provided,
                color: 'var(--color-text-primary)',
                fontFamily: 'Fredoka',
                backgroundColor: state.isFocused ? 'var(--color-background-outline)' : 'white',
              }),
            }}
            onChange={(option) => {
              if (option) {
                updateFilter(option.value as Filter);
              }
            }} />
        </div>
      </div>
    </div>
  )
};
