import React from 'react';
import { userList } from '../../actions/user/user.actions';
import { UserTable } from './_components/user-table';
import { userColumns } from './_components/user-columns';

const page = async() => {
    const users = await userList();

    return (
        <div className=''>
              <div className='flex flex-1 flex-col'>
                <div className='@container/main flex flex-1 flex-col gap-2'>
                  <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6'>
                    <h1>Users</h1>

                    
        
                    <div className=''>
                      <UserTable columns={userColumns} data={users} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
    );
};

export default page;