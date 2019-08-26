import React from 'react';
import ContentLoader from 'react-content-loader';
import humps from 'humps';

import IAyahShape from '../../../shapes/IAyahShape';
import TranscribeAyah from '../TranscribeAyah';
import { ICurrentSurah, ISurahPage } from '../index';
import { PagesWrapper, PageWrapper } from './styles';

interface IProps {
  currentAyah: IAyahShape & { surahName: string };
  previousAyahs: IAyahShape[];
  currentTranscribedIndex?: number;
  currentSurah: ICurrentSurah;
}

interface IState {
  leftPage: ISurahPage | null;
  rightPage: ISurahPage | null;
}

export default class ReadingMode extends React.Component<IProps, IState> {
  state = {
    rightPage: null,
    leftPage: null,
  };

  getPages = () => {
    const { currentSurah, currentAyah } = this.props;
    if (!currentSurah || !currentAyah) {
      return; // do nothing
    }

    const { verseNumber } = currentAyah;
    const pagesNumbers = Object.keys(currentSurah);

    const currentPage: number = Number(
      pagesNumbers.find(
        pn =>
          verseNumber >= currentSurah[pn].first &&
          verseNumber <= currentSurah[pn].last
      )
    );

    if (currentPage % 2 !== 0) {
      this.setState({
        rightPage: currentSurah[currentPage],
        leftPage: currentSurah[currentPage + 1],
      });
    } else {
      this.setState({
        rightPage: currentSurah[currentPage - 1],
        leftPage: currentSurah[currentPage],
      });
    }
  };

  componentDidMount() {
    this.getPages();
  }

  componentDidUpdate(prevProps: IProps) {
    const { currentAyah, currentSurah } = this.props;
    /*
     * get new pages only if the current ayah is diffrent than the last one
     */

    if (
      (currentAyah && currentSurah && !prevProps.currentSurah) ||
      (currentAyah &&
        prevProps.currentAyah &&
        currentAyah.verseNumber !== prevProps.currentAyah.verseNumber)
    ) {
      this.getPages();
    }
  }

  renderPageLoader = () => (
    <ContentLoader height={30}>
      <rect x="80" y="10" rx="3" ry="3" width="250" height="10" />
    </ContentLoader>
  );

  isTranscribed = (ayah: IAyahShape) => {
    const { currentAyah, previousAyahs } = this.props;
    return (
      ayah.verse_number < currentAyah.verseNumber &&
      previousAyahs.some(prevAyah => ayah.verse_number === prevAyah.verseNumber)
    );
  };

  // make sure we only return a value only in the current recitation verse
  getCurrentTranscribedIndex = (ayah: IAyahShape) =>
    ayah.verse_number === this.props.currentAyah.verseNumber
      ? this.props.currentTranscribedIndex
      : 0;

  isActivePage = (page: ISurahPage) =>
    page.ayahs.some(
      ayah => ayah.verse_number === this.props.currentAyah.verseNumber
    );

  renderPage = (page: ISurahPage, isRightPage: boolean) => (
    <PageWrapper
      isActivePage={this.isActivePage(page)}
      isLeftPage={!isRightPage}
      isRightPage={isRightPage}
    >
      {page.ayahs.map(ayah => (
        <TranscribeAyah
          key={ayah.id}
          isTranscribed={this.isTranscribed(ayah)}
          currentTranscribedIndex={this.getCurrentTranscribedIndex(ayah)}
          ayah={humps.camelizeKeys(ayah)}
        />
      ))}
    </PageWrapper>
  );

  render() {
    const { currentSurah, currentAyah } = this.props;
    const { leftPage, rightPage } = this.state;

    if (!currentAyah) {
      return null;
    }

    if (currentAyah && !currentSurah) {
      return this.renderPageLoader();
    }

    return (
      <PagesWrapper>
        {rightPage && this.renderPage(rightPage, true)}
        {leftPage && this.renderPage(leftPage, false)}
      </PagesWrapper>
    );
  }
}
