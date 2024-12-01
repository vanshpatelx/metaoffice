# Database Schema  

### Databases Used:  
- **PostgreSQL**: User, Avatar, Elements, UserSpace  
- **Cassandra DB**: Space, Map  

### Tables  

#### User  
- **id**  
- **username** (email)  
- **password**  
- **created_at**  
- **modified_at**  

#### Avatar  
- **id**  
- **name**  
- **URL**  
- **created_at**  
- **modified_at**  

#### Elements  
- **id**  
- **name**  
- **URL**  
- **size**  
- **static**  
- **created_at**  
- **modified_at**  

#### UserSpace  
- **id**  
- **userId**  
- **spaceId**  
- **created_at**  
- **modified_at**  

#### Space  
- **id**  
- **dimensions**  
- **elements** (Array of objects)  
  - **id**  
  - **element** (Object)  
  - **x**, **y**  
- **created_at**  
- **modified_at**  

#### Map  
- **id**  
- **dimensions**  
- **name**  
- **URL**  
- **elements** (Array of objects)  
  - **id**  
  - **element** (Object)  
  - **x**, **y**  
- **created_at**  
- **modified_at**  