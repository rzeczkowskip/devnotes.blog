import container from '../../config/container';
import Translator from '@/services/translation/Translator';

const useTranslation = () => {
  const translator = container.get<Translator>('translator');

  return translator.trans.bind(translator);
};

export default useTranslation;
