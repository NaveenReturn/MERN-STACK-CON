import { Helmet } from "react-helmet-async"

export default function MetaDate({title}){
    return(
          <Helmet>
               <title>{`${title} - DEEPA`}</title>                    
          </Helmet>
    )
}