import Head from "next/head";
import React from "react";

type Props = {
  description?: string;
  children: React.ReactNode;
  title?: string;
};

const PageContainer = ({ title, description, children }: Props) => (
  <>
  
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <link rel="icon" href="/pana.png" /> {/* Set your logo image here */}
   

    <div>{children}</div>
  </>
);

export default PageContainer;
