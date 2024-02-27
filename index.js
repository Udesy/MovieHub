import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


const API_KEY = "&api_key=4ce47dea628789a25e9e5e4eb744be91";
const BASE_URL = "https://api.themoviedb.org/3"
const IMG_URL = "https://image.tmdb.org/t/p/w500"


app.get("/", async(req, res) => {
    try{
        const popular_movie_response = await axios.get(BASE_URL+"/discover/movie?sort_by=popularity.desc"+API_KEY);
        const popular_result = popular_movie_response.data;
        const trending_movie_response = await axios.get(BASE_URL+"/trending/movie/day?"+API_KEY);
        const trending_result = trending_movie_response.data;
        res.render("home.ejs", {
            popularmoviedata : popular_result.results,
            trendmoviedata : trending_result.results
        })
    }
    catch (error){
                console.error("Failed to make request:", error.message);
                res.render("home.ejs", {
                  error: error.message,
                });
            }
});

app.post("/search", async(req, res) => {
    const name = req.body.movie_name;
    try{
        const response = await axios.get(BASE_URL+"/search/movie?query="+name+API_KEY);
        const result = response.data;
        res.render("home.ejs", {
            search_data : result.results,
        })
    }catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("home.ejs", {
          error: error.message,
        });
    }
});

app.get("/view/:id", async(req, res) =>{
    const movie_id = req.params.id;
    try{
        const response = await axios.get(BASE_URL+"/movie/"+movie_id+"?api_key=4ce47dea628789a25e9e5e4eb744be91");
        const result = response.data;
        var date = new Date(result.release_date);
        const release_date = date.getFullYear();
        var totalMinutes = result.runtime;
        var hour = Math.floor(totalMinutes / 60);
        var minutes = totalMinutes % 60;

        res.render("view.ejs", {
            view_data : result,
            release_date : release_date,
            runtime_hour : hour,
            runtime_minutes : minutes
        })
    }catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("view.ejs", {
          error: error.message,
        });
    }
});

app.listen(port, () =>{
    console.log(`Server is ruuning on port ${port}`);
});