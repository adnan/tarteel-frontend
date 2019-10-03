import KEYS from '../../../locale/keys';

interface ITeam {
  nameKey: KEYS;
  positionKey: KEYS;
  linkedinURL: string;
  facebookURL: string;
  imageSrc: string;
}

const teamData: ITeam[] = [
  {
    nameKey: KEYS.CONTRIBUTOR_NAME_1,
    positionKey: KEYS.CONTRIBUTOR_POSITION_1,
    facebookURL: 'https://facebook.com/tifa2up',
    linkedinURL: 'https://linkedin.com/in/abdellatifabdelfattah',
    imageSrc: require('../../../../public/images/team/Abdellatif Abdelfattah.jpg'),
  },
  {
    nameKey: KEYS.CONTRIBUTOR_NAME_2,
    positionKey: KEYS.CONTRIBUTOR_POSITION_2,
    facebookURL: 'https://www.facebook.com/abdul.alfozan',
    linkedinURL: 'https://www.linkedin.com/in/alfozan',
    imageSrc: require('../../../../public/images/team/Abdulrahman Alfozan.jpg'),
  },
  {
    nameKey: KEYS.CONTRIBUTOR_NAME_6,
    positionKey: KEYS.CONTRIBUTOR_POSITION_6,
    facebookURL: '',
    linkedinURL: 'https://www.linkedin.com/in/aabouallaban/',
    imageSrc: require('../../../../public/images/team/Anas Abou Allaban.jpg'),
  },
  {
    nameKey: KEYS.CONTRIBUTOR_NAME_8,
    positionKey: KEYS.CONTRIBUTOR_POSITION_8,
    facebookURL: 'https://www.facebook.com/hamzah.khan.397',
    linkedinURL: 'https://www.linkedin.com/in/hamzah-khan/',
    imageSrc: require('../../../../public/images/team/Hamzah Khan.jpg'),
  },
  {
    nameKey: KEYS.CONTRIBUTOR_NAME_9,
    positionKey: KEYS.CONTRIBUTOR_POSITION_9,
    facebookURL: 'https://www.facebook.com/fahim.dalvi',
    linkedinURL: 'https://www.linkedin.com/in/fdalvi',
    imageSrc: require('../../../../public/images/team/Fahim Dalvi.jpg'),
  },
  {
    nameKey: KEYS.CONTRIBUTOR_NAME_10,
    positionKey: KEYS.CONTRIBUTOR_POSITION_10,
    facebookURL: '',
    linkedinURL: 'https://www.linkedin.com/in/marwaabdulhai/',
    imageSrc: require('../../../../public/images/team/Marwa Abdulhai.jpg'),
  },
  {
    nameKey: KEYS.CONTRIBUTOR_NAME_11,
    positionKey: KEYS.CONTRIBUTOR_POSITION_11,
    facebookURL: 'https://www.facebook.com/mahmoud.2shraf',
    linkedinURL: 'https://www.linkedin.com/in/22mahmoud',
    imageSrc: require('../../../../public/images/team/Mahmoud Ashraf.jpg'),
  },
  {
    nameKey: KEYS.CONTRIBUTOR_NAME_12,
    positionKey: KEYS.CONTRIBUTOR_POSITION_12,
    facebookURL: 'https://www.facebook.com/mohamed.moussa.39',
    linkedinURL: 'https://www.linkedin.com/in/mohamed-moussa-8b2baba4/',
    imageSrc: require('../../../../public/images/team/Mohamed Moussa.jpg'),
  },
  {
    nameKey: KEYS.CONTRIBUTOR_NAME_13,
    positionKey: KEYS.CONTRIBUTOR_POSITION_13,
    facebookURL: 'https://www.facebook.com/moumensoliman1',
    linkedinURL: 'https://www.linkedin.com/in/moumensoliman',
    imageSrc: require('../../../../public/images/team/Moumen Soliman.jpg'),
  },
  {
    nameKey: KEYS.CONTRIBUTOR_NAME_14,
    positionKey: KEYS.CONTRIBUTOR_POSITION_14,
    facebookURL: 'https://www.facebook.com/Amrelfass',
    linkedinURL: 'https://www.linkedin.com/in/amrfass',
    imageSrc: require('../../../../public/images/team/Amr Elfass.jpg'),
  },
  {
    nameKey: KEYS.CONTRIBUTOR_NAME_15,
    positionKey: KEYS.CONTRIBUTOR_POSITION_15,
    facebookURL: 'https://www.facebook.com/basyounynehela/',
    linkedinURL: 'https://www.linkedin.com/in/basyouny-nehela-69b4967/',
    imageSrc: require('../../../../public/images/team/Basyouny Nehela.jpg'),
  },
];

export default teamData;
