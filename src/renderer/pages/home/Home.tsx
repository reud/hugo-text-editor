import React from 'react';
import { hot } from 'react-hot-loader';
import { InfoCardProps, RecentDataset, WritingData, WritingDataSettings } from '@src/structure';
import { InfoCard } from '@components/infoCard';


const Home: () => React.FC = () => {
  const {common,diary,article,yesterdayDiary} =  (window as any).home.getSettings();
  const contentBasePath = common.contentBasePath;
  const diaryInfoCard: InfoCardProps = {
    ...(diary as WritingDataSettings),
    draft: true,
    isContinue: false,
    label: '日記を書く',
    savePlace: `${contentBasePath}${diary.path}${diary.folderName}/index.md`,
  }
  const yesterdayDiaryInfoCard: InfoCardProps = {
    ...(yesterdayDiary as WritingDataSettings),
    draft: true,
    isContinue: false,
    label: '昨日の日記を書く',
    savePlace: `${contentBasePath}${yesterdayDiary.path}${yesterdayDiary.folderName}/index.md`,
  }
  const articleInfoCard: InfoCardProps = {
    ...(article as WritingDataSettings),
    draft: true,
    isContinue: false,
    label: '昨日の日記を書く',
    savePlace: `${contentBasePath}${article.path}${article.folderName}/index.md`,
  }

  const recentlyDataset =  (window as any).home.genRecentlyDataset() as RecentDataset[];
  const recentlyDatasetProps = recentlyDataset.reverse().map((ds,i) => {
    const wd = (window as any).home.readFileAndParse(ds.place) as WritingData;
    const infoCard: InfoCardProps = {
      ...wd,
      label: ds.title,
      savePlace: ds.place
    }
    infoCard.isContinue = true;
    return infoCard;
  });

  return function Home() {
    return (
      <div id='home'>
        <p className="justify-center flex text-6xl">
          HUGO TEXT WRITER
        </p>
        <p className="my-basic-content"> config file in /Users/reud/Library/Application
          Support/hugo-writer/config.json </p>
        <div className="my-basic-content">
          <div className="card my-card" >
            <div className="card-header">
              <h5 className="mb-1">New Content</h5>
            </div>
            <div className="list-group">
              <InfoCard {...diaryInfoCard} />
              <InfoCard {...yesterdayDiaryInfoCard} />
              <InfoCard {...articleInfoCard} />
            </div>
          </div>
          <div className="my-card">
            <div className="card-header">
              <h5 className="mb-1">Recently Opened</h5>
            </div>
            <div className="list-group" id="open-recent">
              {recentlyDatasetProps.map((prop,i) => {
                return <InfoCard {...prop} key={i} />;
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default hot(module)(Home());