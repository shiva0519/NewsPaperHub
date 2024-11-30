import React, { useContext, useEffect, useState } from 'react';
import NewsPaperService from '../Service/NewsPaperService';
import { store } from './ContextAPI';

const Content = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [dateWiseSearch, setDateWiseSearch] = useState({
    category: '',
    fromDate: '',
    toDate: ''
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setDateWiseSearch((prev) => ({ ...prev, [name]: value }));
  };

  const searchHandler = async (e, isCategorySearch = false) => {
    e.preventDefault();
    if(!loginData) 
      {
        alert("Please login to News Paper Hub")
        console.log("didn't login yet, please login ");
        dateWiseSearch.category="";
        
        return;
      }

    try {
      const res = isCategorySearch
        ? await NewsPaperService.searchNewsByCategory(dateWiseSearch.category)
        : await NewsPaperService.dateWiseHandleSearch(dateWiseSearch);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Error during search:", err);
    }
  };

  const [loginData, setLoginData]=useContext(store);

  const [categories, setCategories]=useState([]);

  const getCategories=()=>
  {
    NewsPaperService.getCategories().then((res)=>
    {
      console.log(res.data)
      setCategories(res.data)
    }).catch((err)=>
    {
      console.log(err)
    })
  }

  useEffect(()=>
  {
    getCategories();
  },[])

  return (
    <div className="conr">
      {/* Search Section */}
      <div className='container'>
        <div className="row mt-5 border border-dark border-1 rounded">
          <div className="col-8 border-end border-dark border-4 p-4 ">
            <form className="d-flex gap-2">
              {/* <lablel className="fw-bold">FromDate</lablel> */}
              <input type="date" className="p-2 rounded mx-2" name="fromDate" onChange={onChangeHandler} />
              {/* <label  className="fw-bold">toDate</label>   */}
              <input type="date" className="p-2 rounded mx-2" name="toDate" onChange={onChangeHandler} />
             {/* <input
                type="search"
                className="p-2 rounded mx-2"
                name="category"
                placeholder="Search Category"
                onChange={onChangeHandler}
                onKeyDown={(e) => e.key === 'Enter' && searchHandler(e, true)}
              /> */}
               <select
                  className="form-control w-100"
                  name="category"
                  onChange={onChangeHandler}
                >
                  <option value="" disabled selected>
                    Select a Category
                  </option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
            
              <button className="btn btn-outline-success" onClick={(e) => searchHandler(e)}>Search</button>
            </form>
          </div>
          <div className="col-4 p-4">
            <form className="d-flex justify-content-end">
              {/* <input
                className="form-control w-100"
                type="search"
                name="category"
                placeholder="Search Category"
                onChange={onChangeHandler}
                // onKeyDown={(e) => e.key === 'Enter' && searchHandler(e, true)}
              /> */}

               <select
                  className="form-control w-100"
                  name="category"
                  onChange={onChangeHandler}
                >
                  <option value="" disabled selected>
                    Select a Category
                  </option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>


              <button className="btn btn-outline-success ms-3" onClick={(e) => searchHandler(e, true)}>Search</button>
            </form>
          </div>
        </div>
      </div>

      {/* Description */}
   
      
      <div className='container '>
        <div className='row'>
        <div className='col-8 p-4'>
          <h3 className='text-center text-light '>Welcome to News Paper Hub</h3>
        <p className='text-left w-100 my-3 p-5 text-light'>
        News Paper Hub is an online platform that serves as a centralized repository for a wide range of newspapers. It provides users with access to local, national, and international newspapers in one convenient location. The platform allows users to stay informed with the latest news, explore various publications, and compare viewpoints across different sources. Whether it's breaking news, in-depth analysis, or editorial opinions, News Paper Hub ensures a seamless and user-friendly experience for accessing diverse content.
        </p>
        </div>
        <div className='col-4 p-4'>
              <img src="https://img.freepik.com/premium-vector/man-reading-newspaper-while-sitting-cafe_797980-2327.jpg" alt="image" width="330px" height="350px"  className='border border-dark border-2 rounded ' />
        </div>    
        </div>
      </div>

     

      {/* Cards Section */}
      {loginData && <div className=' '>
      {searchResults.length > 0 && (
        <div className="row border border-4 border-dark rounded p-2" >
          {searchResults.map((article, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card h-100">
                <img
                  src={article.urlToImage || "https://example.com/default-image.jpg"}
                  className="card-img-top img-1"
                  alt={article.title}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">{article.description}</p>
                  <a
                    href={article.url}
                    className="btn btn-primary mt-auto"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
}
    </div>
  );
};

export default Content;
