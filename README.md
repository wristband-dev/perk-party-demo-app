<div align="center">
  <a href="https://wristband.dev">
    <picture>
      <img src="https://assets.wristband.dev/images/email_branding_logo_v1.png" alt="Github" width="297" height="64">
    </picture>
  </a>
  <p align="center">
    Enterprise-ready auth that is secure by default, truly multi-tenant, and ungated for small businesses.
  </p>
  <p align="center">
    <b>
      <a href="https://wristband.dev">Website</a> •
      <a href="https://wristband.stoplight.io/docs/documentation">Documentation</a>
    </b>
  </p>
</div>

<br/>

---

<br/>

# Perk Party -- A multi-tenant demo app

"Perk Party" is a multi-tenant demo app that serves other companies as its customers. This repo utilizes a "Backend Server" OAuth2 client type. The backend server technology here is Next.js, and the router type is the Pages Router.

> [!NOTE]
> To learn more about what this demo is all about, check our [Live Hosted Demo Docs Page](https://docs.wristband.dev/docs/live-hosted-demo).

<br>

---

<br>

## Table of Contents

- [Developing with Perk Party](#developing-with-perk-party)
  - [Configuring the Next.js Server](#configuring-the-nextjs-server)
  - [Running the Application](#running-the-application)
    - [Install Dependencies](#install-dependencies)
    - [Run the Server with "localhost" URLs](#run-the-server-with-localhost-urls)
    - [Run the Application with "vanity domain" URLs](#run-the-application-with-vanity-domain-urls)
- [How to Interact with Perk Party](#how-to-interact-with-perk-party)
  - [Home Page](#home-page)
  - [Signup](#signup)
  - [Application-level Login (Tenant Discovery)](#application-level-login-tenant-discovery)
  - [Tenant-level Login](#tenant-level-login)
- [Wristband Code Touchpoints](#wristband-code-touchpoints)
- [Setting Up A Local DNS When Using `VANITY_DOMAIN` Format](#setting-up-a-local-dns-when-using-vanity_domain-format)
- [Wristband Next.js SDK](#wristband-nextjs-sdk)
- [Wristband React Client Auth SDK](#wristband-react-client-auth-sdk)
- [Questions](#questions)

<br>

## Developing with Perk Party

### Configuring the Next.js Server

After creating an application and a backend server OAuth2 client in the Wristband dashboard, add the following values in a `.env.local` file:

- `APPLICATION_DOMAIN`
- `DOMAIN_FORMAT` (either `LOCALHOST` or `VANITY_DOMAIN`)
- `CLIENT_ID`
- `CLIENT_SECRET`

### Running the Application

Make sure you are in the root directory of this repository.

#### Install Dependencies

Now install all dependencies:

```npm install```

#### Run the Server with "localhost" URLs

The server will start up on `localhost` with port `6001`.

```npm run dev```

You can also build and run the production mode:

```npm run build```

```npm start```

#### Run the Application with "vanity domain" URLs

Alternatively, if you choose to use custom domains for the demo app, then the server will start up on `app.perkparty.club` with port `6001`. You can run the following command:

```npm run dev-vanity-domain```

You can also build and run the production mode:

```npm run build```

```npm run start-vanity-domain```

<br>

---

<br>

## How to Interact with Perk Party

Wristband hosts all onboarding workflow pages (signup, login, etc), and Next.js will redirect to Wristband in order to show users those pages.

### Home Page

The home page of this app can be accessed at the following locations:

- Localhost domain format: [http://localhost:6001/](http://localhost:6001/)
- Vanity domain format: [http://{tenant_domain}.app.perkparty.club:6001/](http://{tenant_domain}.app.perkparty.club:6001/), where `{tenant_domain}` should be replaced with the value of the desired tenant's name.

### Signup

Once Perk Party is up and running, you can sign up your first user on the Perk Party Signup Page at the following location:

- `http://{application_vanity_domain}/signup`, where `{application_vanity_domain}` should be replaced with the value of the "Application Vanity Domain" value of the Perk Party application (can be found in the Wristband Dashboard by clicking the Application Details side menu of this app).

Completing the signup form will provision both a new tenant with the specified tenant name and a new user that is assigned to that tenant.

### Application-level Login (Tenant Discovery)

Users of Perk Party can access the Perk Party Application-level Login Page to perform tenant discovery at the following location:

- `http://{application_vanity_domain}/login`, where `{application_vanity_domain}` should be replaced with the value of the "Application Vanity Domain" value of the Perk Party application (can be found in the Wristband Dashboard by clicking the Application Details side menu of this app).

Here, the user will be prompted to enter their tenant's name for which they want to log in to.  Successfully entering the tenant name will redirect the user to the tenant-level login page for their specific tenant. Users also have the option here to execute the Forgot Tenant workflow and entering their email address in order to receive a list of all tenants that they belong to.

### Tenant-level Login

If users wish to directly access the Perk Party Tenant-level Login Page without having to go through the application-level login, they can do so at the following locations:

- Localhost domain format: [http://localhost:6001/api/auth/login?tenant_domain={tenant_domain}](http://localhost:6001/home), where `{tenant_domain}` should be replaced with the value of the desired tenant's name.
- Vanity domain format: [http://{tenant_domain}.app.perkparty.club:6001/api/auth/login](http://{tenant_domain}.app.perkparty.club:6001/api/auth/login), where `{tenant_domain}` should be replaced with the value of the desired tenant's name.

Here, the user will be prompted to enter their credentials in order to login to the application.

<br>

## Wristband Code Touchpoints

Within the demo app code base, you can search in your IDE of choice for the text `WRISTBAND_TOUCHPOINT`.  This will show the various places in both the React frontend code and Next.js server code where Wristband is involved.

<br>

## Setting Up A Local DNS When Using `VANITY_DOMAIN` Format

<br/>

If you choose to use vanity domains as the domain format for the demo application, you will need to install a local DNS server to provide custom configurations.  This configuration forces any requests made to domains ending with `.app.perkparty.club` to get routed to your localhost.  This configuration is necessary since all vanity domains that get generated when running the demo application locally will have a domain suffix of  `*.app.perkparty.club`. Therefore, the above setting will force those domains to resolve back to your local machine instead of attempting to route them out to the web.

The goal is the following mapping:
`app.perkparty.club` => `127.0.0.1`.


Here are some options which you can use, depending on your operating system:

- Mac / Linux: [dnsmasq](http://mayakron.altervista.org/support/acrylic/Home.htm)
- Windows: [Acrylic](http://mayakron.altervista.org/support/acrylic/Home.htm)

We also have a blog article on how to [test tenant subdomains with dnsmasq on MacOS](https://www.wristband.dev/blog/how-to-test-tenant-subdomains-on-macos-with-dnsmasq).

<br/>

## Wristband Next.js SDK

This demo app is leveraging the [Wristband nextjs-auth SDK](https://github.com/wristband-dev/nextjs-auth) for all authentication interaction in the Next.js server. Refer to that GitHub repository for more information.

<br>

## Wristband React Client Auth SDK

This demo app is leveraging the [Wristband react-client-auth SDK](https://github.com/wristband-dev/react-client-auth) for any authenticated session interaction in the React frontend. Refer to that GitHub repository for more information.

<br/>

## Questions

Reach out to the Wristband team at <support@wristband.dev> for any questions regarding this demo app.

<br/>
