import React from "react";
import styles from "./BlogContainer.module.scss";
import Facebok from'../../assets/icons/blog-facebook.svg'
import Instagram from '../../assets/icons/blog-instagram.svg'
import Twitter from '../../assets/icons/blog-twitter.svg'
import { useHistory, useLocation } from "react-router-dom";
import {
    makeSlice
} from "../../helpers/product-list-reducer";
import { useEffect, useState } from "react";
import BlogDetails from "../BlogDetails";
import { Link } from "react-router-dom";
import AllBlogs from "../Blogs";
import { useTheme } from '@mui/material/styles';
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";


const getCategory = (blogArr,params) => { 
    let category = '';
    blogArr.map(blog => {
        if(blog.title === params.title) {
            category = blog.category;
        }
    })
    return category;
}


const getTag = (blogArr, params) => { 
    let tag = '';
    blogArr.map(blog => {
        if(blog.title === params.title) {
            tag = blog.tag;
        }
    })
    return tag;
}

const RecentPosts = (recentPosts) => {
    
    const theme = useTheme();
    const recentPostsColor = {"color": theme.palette.text.recentPosts};
    return (
            <div className={styles["recent-posts"]}>
                <div className={styles["side-titles"]}>Recent posts</div>
                <div className={styles['container-recent-posts']}>
                    {recentPosts.map(post => {
                        return (
                            <Link to={`/blog/${post.title}`} key={post.blogId} className={styles['container-recent']}> 
                                <img src={post.mainImage} alt="Post" className={styles['container-img']} />
                                <div> 
                                    <div className={styles['recent-title']} style={recentPostsColor}>{post.title}</div>
                                    <div className={styles['recent-date']}>{post.date.toDate().toString().substring(4,15)}</div>
                                </div>
                            </Link>
                    )})}    
                </div> 
            </div>)
}

const SimilarPosts = (blogArr, params) => {
    let category = getCategory(blogArr, params);
    let similarPostsArr = [];
    blogArr.map(blog => {
        if(blog.category === category) {
            similarPostsArr.push(blog);
        }
    })
    const theme = useTheme();
    const recentPostsColor = {"color": theme.palette.text.recentPosts};
    return (
            <div className={styles["recent-posts"]}>
                <div className={styles["side-titles"]}>Similar posts</div>
                <div className={styles['container-recent-posts']}>
                    {similarPostsArr.map((post, ind) => {
                        if(ind < 3) {
                            return (
                                <Link to={`/blog/${post.title}`} key={post.blogId} className={styles['container-recent']}> 
                                    <img src={post.mainImage} alt="Post" className={styles['container-img']} />
                                    <div> 
                                        <div className={styles['recent-title']} style={recentPostsColor}>{post.title}</div>
                                        <div className={styles['recent-date']}>{post.date.toDate().toString().substring(4,15)}</div>
                                    </div>
                                </Link>
                            )
                        }
                    })}    
                </div> 
            </div>)
}

const Follow = (
    <div className={styles["follow"]}>
        <div className={styles["side-titles"]}>Follow</div>
        <div className={styles['container-follow']}>
            <img src={Facebok} alt="Facebook" className={styles['follow']}/>
            <img src={Instagram} alt="Instagram" className={styles['follow']}/>
            <img src={Twitter} alt="Twitter" className={styles['follow']}/>
        </div>
    </div>
)
    


const BlogContainer = (props) => { 
    const {all, blogs, user} = props;
    let blogArr = blogs;
    const [blogList, setBlogList] = useState(blogArr);
    let categories = ['Hobbies', 'Women', 'Men', 'Shopping', 'Nature', 'Health']
    let tags = ['General', 'Atsanil', 'Insas', 'Bibsaas', 'Nulla']

    
    const parameters = useParams();
    const [search, setSearch] = useState("");
    const [checkCategories, setCheckCategories] = useState(false);
    const [checkTags, setCheckTags] = useState(false)


    const location = useLocation();
    const history = useHistory();   
    const params = new URLSearchParams(location.search);
    const perPage = 3;
    const currentPage = parseInt(params.get("page")) || 1;
    const totalPages = Math.trunc(blogArr.length / perPage) + 1;

    
    const recentPosts = makeSlice(blogArr, 1, perPage);

    const updateURL = (name, value) => {
        const params = new URLSearchParams(location.search);
        params.set(name, value);
        const newURL = `?${params.toString()}`;
        history.push({ pathname: location.pathname, search: newURL });
    }; 

    const handleSearchBar = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    }

    const handlePagination = (e) => {
        window.scrollTo({ top: 400, behavior: "smooth" });
        updateURL("page", currentPage + +e.target.value);
    };

    const handleCategory = (e) => {
        const currentValue = params.get("cat");
        if (!e.target.checked) {
          const newValue = currentValue.split("+").filter((item) => item !== e.target.name).join("+");
          updateURL("cat", newValue);
        } else {
          const newValue = currentValue ? currentValue + "+" + e.target.name: e.target.name;
          updateURL("cat", newValue);
        }
        setCheckCategories(prev => !prev)
    };

    const handleTags = (e) => {
        const currentValue = params.get("tag");
        if (!e.target.checked) {
          const newValue = currentValue.split("+").filter((item) => item !== e.target.name).join("+");
          updateURL("tag", newValue);
        } else {
          const newValue = currentValue ? currentValue + "+" + e.target.name: e.target.name;
          updateURL("tag", newValue);
        }
        setCheckTags(prev => !prev);
    }


    const filterCategories = (blogArr, url) => {
        let checkedCategories = [];
        categories.map(category => {
            if(url.includes(category)) {
                checkedCategories.push(category);
            }
        })
        if(checkedCategories.length === 0) {
            return blogArr;
        }
        let newBlogArr = [];
        blogArr.map(blog => {
            if(checkedCategories.includes(blog.category)) {
                newBlogArr.push(blog);
            }
        })
        return newBlogArr;
    }
    const filterTags = (blogArr, url) => {
        let checkedTags = [];
        tags.map(tag => {
            if(url.includes(tag)) {
                checkedTags.push(tag);
            }
        })
        if(checkedTags.length === 0) {
            return blogArr;
        }
        let newBlogArr = [];
        blogArr.map(blog => {
            if(checkedTags.includes(blog.tag)) {
                newBlogArr.push(blog);
            }
        })
        return newBlogArr;
    }

    
    const filterSearch = (blogArr) => {
        if(search === '') {
            return blogArr;
        }
        let newBlogArr = [];
        blogArr.map(blog => {
            let titleLowerCase = blog.title.toLowerCase();
            let searchLowerCase = search.toLowerCase();
            if(titleLowerCase.includes(searchLowerCase)) {
                newBlogArr.push(blog);
            }
        })
        return newBlogArr;
    }

    
    const filterBlogs = (blogArr) => {
        let url = location.search;
        let newBlogArr = filterCategories(blogArr, url);
        newBlogArr = filterTags(newBlogArr, url);
        newBlogArr = filterSearch(newBlogArr)
        return newBlogArr;
    }

    useEffect( () => {
        const FilteredBlogs = filterBlogs(blogArr);
        const blogsPage = makeSlice(FilteredBlogs, currentPage, perPage);
        setBlogList(blogsPage);
    }, [checkCategories, checkTags, search, currentPage]) 
 



    /*
    useEffect( () => {
        let url = location.search;
        const filteredBlogs = filterCategories(blogArr, url);
        const blogsPage = makeSlice(filteredBlogs, currentPage, perPage);
        setBlogList(blogsPage);
    }, [checkCategories])

    useEffect( () => {
        let url = location.search;
        const filteredBlogs = filterTags(blogArr, url);
        const blogsPage = makeSlice(filteredBlogs, currentPage, perPage);
        setBlogList(blogsPage);
    }, [checkTags])

    useEffect( () => {
        const filteredBlogs = filterSearch(blogArr);
        const blogsPage = makeSlice(filteredBlogs, currentPage, perPage);
        setBlogList(blogsPage);
    }, [search])

    useEffect( () => {
        const blogsPage = makeSlice(blogList, currentPage, perPage);
        setBlogList(blogsPage);
    }, [currentPage])
    
    */

    return (
        <div className={styles["container"]}>
            {all ? 
                <AllBlogs 
                    blogList = {blogList}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePagination={handlePagination}
                /> :
                <BlogDetails blogList = {blogList}/>
            }
            
            <div className={styles["container-side"]}>
                <div className={styles["container-create-blog"]}>   
                    <Link  to={typeof myVar !== "undefined" ? `/create-blog` :`/login` } className={styles["create-blog-button"]}>
                        Create Blog
                    </Link>
                </div>
                {all?
                    <div className={styles["container-search"]}>                 
                        <div className={styles["side-titles"]}>Search</div>
                        <form >
                            <input
                                type="text"
                                placeholder="Search for posts"
                                className={styles["search-form"]}
                                onChange={handleSearchBar}
                            />
                        </form>
                    </div> : <></>
                }
                <div>
                    <div className={styles["side-titles"]}>Categories</div>
                    <div className={styles["container-categories"]} >
                        {categories.map (category => {
                            return <div key={category}>
                                        <input  type='checkbox' 
                                                className={styles["checkbox"]} 
                                                name={category}
                                                id={category} 
                                                onChange={(e) => handleCategory(e)}
                                                disabled={!all}/>
                                        <label className={((document.getElementById(category) !== null && 
                                                            document.getElementById(category).checked) ||
                                                            getCategory(blogArr,parameters)===category) ? 
                                                            [styles["category"], styles["category-checked"]].join(' '): styles["category"]} 
                                                            htmlFor={category}> {category} </label>
                                    </div>
                        })}
                    </div>
                </div>
                {all ? RecentPosts(recentPosts) : SimilarPosts(blogArr, parameters)}
                <div>
                    <div className={styles["side-titles"]} >Tags</div>
                    <div className={styles['container-tags']} >
                        {tags.map(tag => {
                            return  <div key={tag}> 
                                        <input  type='checkbox' 
                                                className={styles["checkbox"]} 
                                                name={tag}
                                                id={tag} 
                                                onChange={(e) => handleTags(e)}
                                                disabled={!all}/>
                                        <label className={((document.getElementById(tag) !== null && 
                                                            document.getElementById(tag).checked) || 
                                                            getTag(blogArr,parameters)===tag) ? 
                                                            [styles["tag-button"], styles["tag-checked"]].join(' ') : 
                                                            styles["tag-button"]} htmlFor={tag} >{tag}</label>
                                    </div>
                        })}
                    </div>
                </div>
                {Follow}
            </div>
        </div>
    )
}

export default BlogContainer