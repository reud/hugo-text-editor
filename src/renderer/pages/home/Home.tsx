import React  from 'react';
import { hot } from 'react-hot-loader';
import { InfoCardProps, RecentDataset, WritingData, WritingDataSettings } from '@src/structure';
import { InfoCard } from '@components/infoCard';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Home: React.FC = () => {
  const {common,diary,article,yesterdayDiary} =  (window as any).home.getSettings();
  const contentBasePath = common.contentBasePath;
  const nav = useNavigate();

  const diarySavePlace = `${contentBasePath}${diary.path}${diary.folderName}/index.md`;
  const diaryInfoCard: InfoCardProps = {
    ...(diary as WritingDataSettings),
    draft: true,
    isContinue: (window as any).home.checkFileExist(diarySavePlace),
    label: '日記を書く',
    savePlace: diarySavePlace,
    disabled: (window as any).home.checkFileExist(diarySavePlace)
  }

  const yesterdayDiaryPlace = `${contentBasePath}${yesterdayDiary.path}${yesterdayDiary.folderName}/index.md`;
  const yesterdayDiaryInfoCard: InfoCardProps = {
    ...(yesterdayDiary as WritingDataSettings),
    draft: true,
    isContinue: (window as any).home.checkFileExist(diarySavePlace),
    label: '昨日の日記を書く',
    savePlace: yesterdayDiaryPlace,
    disabled: (window as any).home.checkFileExist(yesterdayDiaryPlace)
  }

  const articlePlace = `${contentBasePath}${article.path}${article.folderName}/index.md`;
  const articleInfoCard: InfoCardProps = {
    ...(article as WritingDataSettings),
    draft: true,
    isContinue: (window as any).home.checkFileExist(diarySavePlace),
    label: '記事を書く',
    savePlace: articlePlace,
    disabled: (window as any).home.checkFileExist(articlePlace)
  }

  const recentlyDataset =  (window as any).home.genRecentlyDataset() as RecentDataset[];
  const recentlyDatasetProps = recentlyDataset.reverse().map((ds,i) => {
    const wd = (window as any).home.readFileAndParse(ds.place) as WritingData;
    const infoCard: InfoCardProps = {
      ...wd,
      label: ds.title,
      savePlace: ds.place,
      disabled: false
    }
    infoCard.isContinue = true;
    return infoCard;
  });

  const openFolder = () => {
    (window as any).home.getIpcRenderer().invoke('folder-open')
      .then((path: any) => {
        const wd = (window as any).home.readFileAndParse(`${path}/index.md`) as WritingData;
        nav('/edit',{
          state: wd
        });
      })
      .catch((err: any) => {
        alert(err);
      });
  };


    return (
      <div id='home'>
        <Typography variant={'h2'} align={'center'} pb={3}>
          HUGO TEXT WRITER
        </Typography>
        <p className="my-basic-content"> config file in /Users/USER/Library/Application
          Support/hugo-text-writer/config.json </p>
        <Button onClick={openFolder}>
          Open Folder
        </Button>
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

export default hot(module)(Home);