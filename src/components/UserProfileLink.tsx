import { OverlayTrigger, Tooltip } from "@/components/bootstrap";
import { User } from "@/models/user";
import { formatDate } from "@/utils/utils";
import Link from "next/link";
import ProfileImage from "./ProfileImage";

interface UserProfileLinkProps {
  user: User;
}

export default function UserProfileLink({ user }: UserProfileLinkProps) {
  return (
    <OverlayTrigger
      overlay={
        <Tooltip className="position-absolute">
          <UserTooltipContent user={user} />
        </Tooltip>
      }
      delay={{ show: 500, hide: 0 }}
    >
      <span className="d-flex align-items-center w-fit-content">
        <ProfileImage
          src={user.profilePicUrl}
          alt={`Profile pic user: ${user.username}`}
        />
        <Link href={`/users/${user.username}`} className="ms-2">
          {user.displayName}
        </Link>
      </span>
    </OverlayTrigger>
  );
}

interface UserTooltipContentProps {
  user: User;
}

function UserTooltipContent({
  user: { username, about, profilePicUrl, createdAt },
}: UserTooltipContentProps) {
  return (
    <div>
      <ProfileImage
        src={profilePicUrl}
        width={150}
        height={150}
        alt={`Profile pic user: ${username}`}
        className="rounded-circle mb-1"
      />
      <div className="text-start">
        <strong>Username:</strong> {username} <br />
        <strong>User since:</strong> {formatDate(createdAt)} <br />
        {about && (
          <>
            <strong>About:</strong> {about}
          </>
        )}
      </div>
    </div>
  );
}
