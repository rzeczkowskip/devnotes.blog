import container from '../../config/container';
import Translator from '@/services/translation/Translator';

const useTranslation = () => {
  const translator = container.get<Translator>('translator');

  return {
    t: translator.trans.bind(translator),
    locale: translator.locale,
  };
};

export default useTranslation;
