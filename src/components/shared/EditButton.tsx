import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'


const EditButton = () => {
  const navigate = useNavigate();
  return (
    <div>
  
  <Button className="shad-button_light_3 tracking-tight" onClick={() => navigate('/edit-profile')}>
      Edit Profile
    </Button>
      
    </div>
  )
}

export default EditButton