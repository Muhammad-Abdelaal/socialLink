import Main from "../../Components/Layout/Main/Main";
import NewPost from "../../Components/Main Comps/New Post/NewPost";
import Posts from "../../Components/Main Comps/Posts/Posts";


function Home() {
    return (
        <Main>
            <NewPost />
            <Posts />
        </Main>

    )
}

export default Home;