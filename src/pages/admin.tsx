import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import wristbandService from '@/services/wristband-service';
import { useWristband } from '@/context/auth-context';
import { getSession } from '@/session/iron-session';
import { Tenant } from '@/types';
import { serverRedirectToLogin } from '@/utils/helpers';

type SettingsPageProps = {
  tenant: Tenant;
};

export default function AdminPage({ tenant }: SettingsPageProps) {
  const { isAuthenticated, user } = useWristband();
  const { id, applicationId, vanityDomain, domainName, displayName, description, signupEnabled, status } = tenant;

  return (
    <section className="p-8">
      <div style={{ margin: '0 auto' }}>
        <h1 className="text-3xl font-bold underline">Admin</h1>
      </div>

      <div style={{ margin: '2rem auto' }}>
        <h3>Who is authenticated?</h3>
        <h4>{isAuthenticated ? `${user.email}` : 'Noboby'}</h4>
      </div>

      {isAuthenticated && (
        <div style={{ margin: '2rem auto' }}>
          <h3>Tenant Info</h3>
          <p>ID: {id}</p>
          <p>Application ID: {applicationId}</p>
          <p>Vanity Domain: {vanityDomain}</p>
          <p>Domain Name: {domainName}</p>
          <p>Display Name: {displayName}</p>
          <p>Description: {description}</p>
          <p>Tenant Signup Enabled: {signupEnabled ? 'Yes' : 'No'}</p>
          <p>Status: {status}</p>
        </div>
      )}
    </section>
  );
}

// NOTE: This gets called first every time BEFORE this page loads. The returned props are passed to the page
// above. The server will evaluate/render everything once on the server before sending the browser its 1st HTML.
export const getServerSideProps: GetServerSideProps = async function (context: GetServerSidePropsContext) {
  const { req, res } = context;
  const session = await getSession(req, res);
  const { accessToken, isAuthenticated, user } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return serverRedirectToLogin(req);
  }

  try {
    const tenant = await wristbandService.getTenant(accessToken, user.tenantId!);
    return { props: { tenant } };
  } catch (err: unknown) {
    console.log(err);
    throw err;
  }
};
