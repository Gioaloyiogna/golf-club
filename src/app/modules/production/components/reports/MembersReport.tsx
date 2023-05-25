import {PageTitle} from '../../../../../_metronic/layout/core'
import {Route, Routes} from 'react-router-dom'
import ReportComponent from './ReportComponent'

export const Reports: any = () => {
  let accountBreadCrumbs: any = []
  return (
    <Routes>
      <Route
        path='members-report'
        element={
          <>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Member List Report</PageTitle>
            {/*<Members />*/}
            <ReportComponent reportName="MemberListReport"/>
          </>
        }
      />
    </Routes>
  )
}
