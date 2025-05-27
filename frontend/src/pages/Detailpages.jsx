import { useParams } from "react-router-dom";

export default function DetailPages() {
  const {id}=useParams()
  return <div>This is a test {id}.</div>;
}
