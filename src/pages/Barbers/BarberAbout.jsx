/* eslint-disable react/prop-types */
import { formateDate } from '../../utils/formateDate'

const BarberAbout = ({name, about, achievements, experience}) => {
  return (
      <div>
          <div>
              <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold
              flex items-center gap-2'>About
                  <span className='text-irisBlueColor font-bold text-[20px] leading-9'>
                      {name}
                  </span>
              </h3>
                <p className="text__para text-textColor dark:text-gray-300">
                  {about}
                </p>
          </div>

            {/* ====== ABOUT SPECIFIC (EDUCATION) ====== */}
          <div className='mt-12'>
              <h3 className='text-[20px] leading-[30px] text-headingColor dark:text-gray-100 font-semibold'>
              Achievements
              </h3>

               {/* ====== MAIN ====== */}
              <ul className='pt-4 md:p-5'>

                {achievements?.map((item,index)=>   <li key={index} className='flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]'>
                      <div>
                            <span className='text-irisBlueColor text-[15px] leading-6 font-semibold dark:text-irisBlueColor'>
                              {formateDate(item.date)}
                          </span>
                          {/* <p className='text-[16px] leading-6 font-medium text-textColor'>
                          Type Of Achievement
                          </p> */}
                      </div>
                        <p className='text-[14px] leading-5 font-medium text-textColor dark:text-gray-300'>
                      {item.title}
                          </p>
                  </li>
)}
                 {/* ======1ST====== */}
               
                  {/* =====2ND======== */}
                  
              </ul>
          </div>


        {/* ====== ABOUT SPECIFIC ====== */}
          <div className='mt-12'>
              <h3 className='text-[20px] leading-[30px] text-headingColor dark:text-gray-100 font-semibold'>
                  Experience
              </h3>
              <ul className='grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5'>

                {experience?.map((item,index)=>         <li key={index} className='p-4 rounded bg-[#fff9ea] dark:bg-slate-800'>
                      <span className='text-yellowColor text-[15px] leading-6 font-semibold dark:text-yellowColor'>
                        {formateDate(item.startingDate)} - {formateDate(item.endingDate)}
                      </span>
                      <p className='text-[16px] leading-6 font-medium text-textColor dark:text-gray-200'>
                              {item.role}
                      </p>
                      <p className='text-[14px] leading-5 font-medium text-textColor dark:text-gray-200'>
                              {item.workplace}
                        </p>
                      <p className='text-[14px] leading-5 font-medium text-textColor dark:text-gray-200'>
                              {item.description}
                        </p>
                  </li>)}
                    {/* ===== 1st ======== */}
          

                    {/* ===== 2nd ======== */}
                 
              </ul>
          </div>
    </div>
  )
}

export default BarberAbout