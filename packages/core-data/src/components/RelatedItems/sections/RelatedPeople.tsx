interface RelatedPeopleProps {

  data: any;

}

export const RelatedPeople = (props: RelatedPeopleProps) => {

  console.log(props.data);

  return (
    <div className="p-3 pb-4 grid grid-cols-3 gap-1">
      No related people
    </div>
  )

}