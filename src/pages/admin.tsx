import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import wristbandService from '@/services/wristband-service';
import { useWristband } from '@/context/auth-context';
import { getSession } from '@/session/iron-session';
import { Tenant } from '@/types';
import { serverRedirectToLogin } from '@/utils/helpers';

export default function AdminPage() {
  const { isAuthenticated, user, tenant, setTenant } = useWristband();
  const publicMetaData = tenant.publicMetadata;
  const perkCategories = publicMetaData.perkCategories || [];



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
          {/* <h3>Tenant Info</h3>
          <p>ID: {id}</p>
          <p>Application ID: {applicationId}</p>
          <p>Vanity Domain: {vanityDomain}</p>
          <p>Domain Name: {domainName}</p>
          <p>Display Name: {displayName}</p>
          <p>Description: {description}</p>
          <p>Tenant Signup Enabled: {signupEnabled ? 'Yes' : 'No'}</p>
          <p>Status: {status}</p> */}
        </div>
      )}
    </section>
  );
}
