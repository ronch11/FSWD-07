import React from 'react'
import { useUser } from "../../UserContext.jsx";
import { useEffect, useState, useContext } from "react";
import ApiContext from "../../ApiContext.jsx";
import VideoButton from '../Video/VideoButton.jsx';
import '../../Styles/Home.css';
import {Col, Container, Row} from "reactstrap";



function Home() {
    const user = useUser();
    const api = useContext(ApiContext);
    const [videos, setVideos] = useState([]);

    const homeStyle = {
      // display: 'grid',
      // gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', // This will create responsive grid layout for videos
      // gridGap: '1rem', // Gap between videos
      // padding: '1rem',
      // boxSizing: 'border-box',
      // margin: '0 auto',
      // maxWidth: '1200px',
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        console.log(accessToken);
        // load videos for user
        // set access token header
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        api.get("/videos/recommendations").then(response => {
            console.log(response);
            setVideos(response.data);
        })
    }, [])
    

  return (
      <>
        <h1>Home</h1>
          <section>
              <Container>
                  <Row>
                      videos?.map((video) => (
                      <Col lg="3" md="2" sm="6" className="mb-4" key={item.id}>
                      return <VideoButton video={video} baseurl={api.defaults.baseURL} />
                      </Col>
                      ))}
                  </Row>
              </Container>
          </section>

      </>

  );

}

export default Home
