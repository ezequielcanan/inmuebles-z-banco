import { useEffect, useState } from "react"
import Title from "../components/Title"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { BounceLoader } from "react-spinners"
import ProjectCard from "../components/ProjectCard"
import CookiesJs from "js-cookie"

const Projects = ({setProject}) => {
  const [projects, setProjects] = useState(false)

  useEffect(() => {
    customAxios.get("/projects?filter=false").then(res => {
      setProjects(res?.data?.payload || [])
    }).catch(e => {
      console.log(e)
      setProjects(false)
    })
  }, [])

  return <Main className={"flex flex-col gap-y-[20px] pb-[120px]"} paddings>
    <section>
      <Title className={"text-center xl:text-start"}>Proyectos</Title>
    </section>
    <section className="grid gap-8 justify-items-center xl:justify-items-start md:grid-cols-2 2xl:grid-cols-3">
      {projects.length ? (
        projects.map((project, i) => {
          const cardPath = `/accounts`
          return <ProjectCard onClick={() => (setProject(project?._id), CookiesJs.set("banksProject", project?._id))} thumbnail={project.thumbnail} title={project.title} id={project?._id} key={project?._id} path={cardPath} />
        })
      ) : (
        <BounceLoader />
      )}
    </section>
  </Main>
}

export default Projects