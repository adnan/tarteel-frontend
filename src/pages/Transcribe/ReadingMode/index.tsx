import React from 'react';
import ContentLoader from 'react-content-loader';
import humps from 'humps';
import _ from 'lodash';

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

    // use this hack because our api ayah shape doesn't have page number
    const currentPage: number = _.chain(_.merge({}, ..._.values(currentSurah)))
      .get('ayahs')
      .find(ayah => ayah.verse_number === this.props.currentAyah.verseNumber)
      .get('page_number')
      .value();

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

  isTranscribed = (ayah: IAyahShape, line) => {
    const { currentAyah, previousAyahs } = this.props;
    return (
      ayah.verse_number < currentAyah.verseNumber &&
      previousAyahs.some(prevAyah => ayah.verse_number === prevAyah.verseNumber)
    );
  };

  // make sure we only return a value only in the current recitation verse
  getCurrentTranscribedIndex = (ayah: IAyahShape, line) => {
    if (ayah.verse_number === this.props.currentAyah.verseNumber) {
      // get the first word ayah located in the current line
      const firstWordId = _.chain(line)
        .get(ayah.verse_number)
        .first()
        .get('id')
        .value();

      // get the index of the first word in the ayah
      const theFirstWordIndexInTheAyah = _.chain(ayah.words)
        // remove all symbols words
        .filter('text_simple')
        .findIndex(word => word.id === firstWordId)
        .value();

      // if the word index greater than or equal the currentTranscribeIdex thats mean this word in onther lineo
      // so we don't highlight it
      if (theFirstWordIndexInTheAyah >= this.props.currentTranscribedIndex) {
        return 0;
      }

      // else we recalculate the current index
      return this.props.currentTranscribedIndex - theFirstWordIndexInTheAyah;
    }
    return 0;
  };

  isActivePage = (page: ISurahPage) =>
    Object.values(page.ayahs).some(
      ayah => ayah.verse_number === this.props.currentAyah.verseNumber
    );

  renderPage = (page: ISurahPage, isRightPage: boolean) => {
    /*
     * format the lines to this object
     * line =>
     * {
     *  <ayah-number>: [<word>, ...],
     *  ...
     * }
     */
    const lines = _.chain(page.lines)
      .map(line =>
        _.groupBy(line, word =>
          _.chain(word.verse_key)
            .split(':')
            .last()
            .value()
        )
      )
      .value();

    return (
      <PageWrapper
        isActivePage={this.isActivePage(page)}
        isLeftPage={!isRightPage}
        isRightPage={isRightPage}
      >
        {lines.map(line => (
          <div>
            {_.map(_.keys(line), _.toNumber).map((ayahNumber: number) => (
              <TranscribeAyah
                key={ayahNumber}
                isTranscribed={this.isTranscribed(page.ayahs[ayahNumber], line)}
                currentTranscribedIndex={this.getCurrentTranscribedIndex(
                  page.ayahs[ayahNumber],
                  line
                )}
                // pass the ayah like this to act like the ayah not line
                ayah={humps.camelizeKeys({ words: line[ayahNumber] })}
              />
            ))}
          </div>
        ))}
      </PageWrapper>
    );
  };

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
