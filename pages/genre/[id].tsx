import React from "react";
import AppLayout from "../../layouts/appLayout";
import axios from "axios";
import API_URL from "../../configs/apiUrl";
import CustomImage from "../../components/CustomImage";
import { Artists } from "../../interfaces/artist";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  playPause,
  setActiveSong,
} from "../../stores/player/currentAudioPlayer";
import { TrackProps, CoverImage } from "../../interfaces/Track";
import ListItem from "../../components/ListItem";
import HorizontalTracksList from "../../components/HorizontalTracksList";
import { tags } from "../../interfaces/genres";
import HorizontalArtistsList from "../../components/HorizontalArtistsList";
import { useRef, useEffect, useState } from "react";
import { shadeColor } from "../../configs/shadeColor";

function GenrePage({
  artists,
  tracks,
  tag,
}: {
  tag: any;
  artists: Artists[];
  tracks: TrackProps[];
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [srcollPosition, setScrollPosition] = useState(0);
  const [isScrolling, setScrolling] = useState(false);

  const onScroll = (e: any) => {
    setScrolling(true);
    setScrollPosition(e.target.scrollTop);
  };

  setTimeout(() => {
    setScrolling(false);
  }, 100);

  return (
    <AppLayout
      title={tag.tag}
      color={"#" + tag.color.toString(16)}
      onScroll={onScroll}
    >
      <div>
        <div
          style={{
            backgroundColor:
              srcollPosition >= 300
                ? shadeColor("#" + tag.color.toString(16).substring(0, 6), -50)
                : "transparent",
          }}
          className="absolute px-8 py-4 z-20 mobile:px-4 tablet:px-6 mini-laptop:px-7
          w-[calc(100vw_-_14rem)] mini-laptop:w-[calc(100vw_-_55px)] 
        tablet:w-screen mobile:w-screen overflow-x-hidden flex items-center mobile:py-2
          "
        >
          <div
            onClick={() => router.back()}
            className="w-fit bg-black  text-center 
            flex items-center justify-center rounded-full px-1 bg-opacity-25 hover:bg-opacity-50 cursor-pointer"
          >
            <i className="icon-arrow_back text-[20px] text-center pl-2 py-2 mobile:text-base mobile:py-1"></i>
          </div>
          <div className="mx-4">
            {srcollPosition >= 300 && (
              <h1 className="text-2xl capitalize font-ProximaBold mobile:text-xl">
                {tag.tag}
              </h1>
            )}
          </div>
        </div>
      </div>
      <div className="px-10 pt-32 mobile:pt-20 mini-laptop:px-6 tablet:px-6 mobile:px-4">
        <h1
          className="pb-6 text-[70px] laptop:text-[60px] 
            mini-laptop:text-[60px] tablet:text-[45px] mobile:text-[40px] capitalize font-ProximaBold"
        >
          {tag.tag}
        </h1>
        <h4 className="font-ProximaBold pb-6 text-gray-400">
          Related Artists:
        </h4>
      </div>
      <HorizontalArtistsList artists={artists} />
      <div className="px-8 mini-laptop:px-6 tablet:px-6 mobile:px-4">
        <h4 className="pt-8 font-ProximaBold pb-6 text-gray-400">
          Popular Tracks:
        </h4>
        {tracks.map((track: TrackProps, i: number) => {
          return (
            <ListItem
              isScrolling={isScrolling}
              onTap={() => {
                dispatch(setActiveSong({ tracks: tracks, index: i }));
              }}
              key={track.id}
              track={track}
              showNumber={i + 1}
            />
          );
        })}
      </div>
      <div className="pb-32"></div>
    </AppLayout>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const { data } = await axios.get(
      API_URL + "/songs/tag/" + context.params.id
    );
    const tracks = await axios.get(
      API_URL + "/artists/tag/" + context.params.id
    );
    const tag = tags.find((tag: any) => {
      return tag.tag == context.params.id;
    });
    return {
      props: {
        success: true,
        tag: tag,
        tracks: data.data,
        artists: tracks.data.data,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        success: false,
      },
    };
  }
}

export default GenrePage;
