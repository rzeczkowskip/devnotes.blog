import Image from 'next/image';
import container from '../config/container';
import PageContent from '@/components/devnotesV2/PageContent';
import useTranslation from '@/hooks/useTranslation';
import Content from '@/services/content/Content';
import image404 from '@assets/404.gif';

const NotFound = () => {
  const contentLoader = container.get<Content>('content');
  const { t } = useTranslation();

  const title = t('not_found_title');

  const page = contentLoader.getDummyPage('page', title, '/', {
    metadata: { subtitle: t('not_found_subtitle') },
  });

  return (
    <>
      <PageContent page={page}>
        <Image
          src={image404}
          alt={title}
          priority
          className="rounded mx-auto"
        />
      </PageContent>
    </>
  );
};

export default NotFound;
