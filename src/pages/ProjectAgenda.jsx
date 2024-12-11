import { useEffect, useState } from "react"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import Title from "../components/Title"
import Section from "../containers/Section"
import Button from "../components/Button"

const ProjectAgenda = () => {
  const [project, setProject] = useState(null)
  const { pid } = useParams()

  useEffect(() => {
    customAxios.get(`/projects/${pid}`).then(res => {
      setProject(res?.data?.payload || [])
    }).catch(e => {
      console.log(e)
      setProject(false)
    })
  }, [])

  return <Main className={"flex flex-col gap-y-[20px] pb-[120px]"} paddings>
    {project ? (
      <Section className={"flex gap-x-[40px] items-center flex-wrap"}>
        <Title className={"text-center xl:text-start"}>Cheques recibidos - {project?.title}</Title>
        <Button>Nuevo Cheque</Button>
      </Section>
    ) : (
      <BounceLoader />
    )}
  </Main>
}

export default ProjectAgenda